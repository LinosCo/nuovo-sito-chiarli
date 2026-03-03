import crypto from 'crypto';
import {
  BTAITipsPayload,
  BTInterventionType,
  BTTaskType,
  BT_AI_TIPS_CONTRACT_VERSION,
  validateBTAITipsPayload,
} from './bt-ai-tips.contract.js';
import { contentService, ContentType } from './content.service.js';

export type BTAITipsJobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'blocked';
export type BTAITipsRiskLevel = 'low' | 'medium' | 'high';

export interface BTAITipsQualityChecks {
  rulesPassed: string[];
  rulesFailed: string[];
}

export interface BTAITipsChangeTarget {
  scopeType: 'SITE' | 'SECTION' | 'PAGE' | 'COMPONENT';
  siteId: string;
  sectionId?: string;
  pageId?: string;
  url?: string;
  componentRef?: string;
  field: string;
  contentType?: ContentType;
  itemId?: number;
}

export interface BTAITipsChange {
  changeType: 'replace';
  target: BTAITipsChangeTarget;
  before: string | null;
  after: string;
}

export interface BTAITipsResult {
  status: 'completed' | 'blocked' | 'failed';
  jobId: string;
  contractVersion: string;
  interventionType: BTInterventionType;
  taskType: BTTaskType;
  summary: string;
  changes: BTAITipsChange[];
  qualityChecks: BTAITipsQualityChecks;
  riskLevel: BTAITipsRiskLevel;
  needsHumanReview: boolean;
  humanReviewReasons: string[];
  audit: {
    promptHash: string;
    processedAt: string;
    durationMs: number;
  };
  error?: string;
}

export interface BTAITipsJob {
  jobId: string;
  status: BTAITipsJobStatus;
  idempotencyKey?: string;
  payload: BTAITipsPayload;
  createdAt: string;
  updatedAt: string;
  appliedAt?: string;
  result?: BTAITipsResult;
  error?: string;
}

export interface BTAITipsMetrics {
  totalJobs: number;
  completedJobs: number;
  blockedJobs: number;
  failedJobs: number;
  manualReviewJobs: number;
  avgLatencyMs: number;
}

export class BTAITipsServiceError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

const VALID_CONTENT_TYPES: ContentType[] = [
  'wines',
  'tenute',
  'experiences',
  'news',
  'settings',
  'pages/home',
  'pages/storia',
];

const TASK_DEFAULT_FIELD: Partial<Record<BTTaskType, string>> = {
  OPTIMIZE_TITLE: 'seo.title',
  OPTIMIZE_META_DESCRIPTION: 'seo.metaDescription',
  OPTIMIZE_H1_H2: 'headings',
  REWRITE_CTA: 'cta.text',
  REFINE_VALUE_PROP: 'valueProposition',
  SIMPLIFY_FORM_COPY: 'form.copy',
  REDUCE_FRICTION_COPY: 'form.copy',
  ADD_IMAGE_ALT_TEXT: 'image.alt',
  FIX_LINK_TEXT_CLARITY: 'links',
  IMPROVE_HEADING_STRUCTURE: 'headings',
  ENFORCE_LEGAL_DISCLAIMER: 'legal.disclaimer',
  STANDARDIZE_SECTIONS: 'sections',
  IMPROVE_ENTITY_COVERAGE: 'content',
  SUMMARIZE_SECTION: 'content',
  REWRITE_BLOCK: 'content',
  EXPAND_SECTION: 'content',
  IMPROVE_READABILITY: 'content',
  SIMPLIFY_LANGUAGE: 'content',
  ALIGN_TONE: 'content',
  APPLY_STYLE_GUIDE: 'content',
  NORMALIZE_TERMINOLOGY: 'content',
  LOCALIZE_COPY: 'content',
};

const REVIEW_REQUIRED = new Set<BTInterventionType>([
  'SEO_ONPAGE',
  'CONVERSION_CRO',
  'CONTENT_GOVERNANCE',
]);

const REVIEW_RECOMMENDED = new Set<BTInterventionType>([
  'CONTENT_QUALITY',
  'ACCESSIBILITY_COMPLIANCE',
  'BRAND_VOICE',
]);

export class BTAITipsService {
  private jobs = new Map<string, BTAITipsJob>();
  private idempotencyStore = new Map<string, string>();
  private rateLimitStore = new Map<string, { windowStart: number; count: number }>();
  private metrics: BTAITipsMetrics = {
    totalJobs: 0,
    completedJobs: 0,
    blockedJobs: 0,
    failedJobs: 0,
    manualReviewJobs: 0,
    avgLatencyMs: 0,
  };
  private totalLatencyMs = 0;

  isEnabled(): boolean {
    return String(process.env.BT_AI_TIPS_ENABLED || 'false').toLowerCase() === 'true';
  }

  getJob(jobId: string): BTAITipsJob | null {
    return this.jobs.get(jobId) || null;
  }

  getMetrics(): BTAITipsMetrics {
    return { ...this.metrics };
  }

  async createJob(
    payloadInput: unknown,
    idempotencyKey?: string
  ): Promise<{ job: BTAITipsJob; duplicated: boolean }> {
    if (!this.isEnabled()) {
      throw new BTAITipsServiceError(
        'BT AI Tips integration is disabled',
        503,
        'BT_AI_TIPS_DISABLED'
      );
    }

    this.enforcePayloadSize(payloadInput);

    const validation = validateBTAITipsPayload(payloadInput);
    if (!validation.valid || !validation.payload) {
      throw new BTAITipsServiceError(
        `Invalid payload: ${validation.errors.join('; ')}`,
        400,
        'INVALID_PAYLOAD'
      );
    }

    const payload = validation.payload;
    this.enforceTenantIsolation(payload.siteId);
    this.enforceRateLimit(payload.siteId);

    if (idempotencyKey) {
      const existingJobId = this.idempotencyStore.get(this.buildIdempotencyKey(payload.siteId, idempotencyKey));
      if (existingJobId) {
        const existingJob = this.jobs.get(existingJobId);
        if (existingJob) {
          return { job: existingJob, duplicated: true };
        }
      }
    }

    const now = new Date().toISOString();
    const jobId = `job_${crypto.randomUUID().replace(/-/g, '')}`;
    const job: BTAITipsJob = {
      jobId,
      status: 'queued',
      idempotencyKey,
      payload,
      createdAt: now,
      updatedAt: now,
    };

    this.jobs.set(jobId, job);
    this.metrics.totalJobs += 1;

    if (idempotencyKey) {
      this.idempotencyStore.set(this.buildIdempotencyKey(payload.siteId, idempotencyKey), jobId);
    }

    setImmediate(() => {
      void this.processJob(jobId);
    });

    return { job, duplicated: false };
  }

  async applyJob(jobId: string, appliedBy: string): Promise<{ job: BTAITipsJob; appliedCount: number }> {
    const job = this.jobs.get(jobId);

    if (!job) {
      throw new BTAITipsServiceError('Job not found', 404, 'JOB_NOT_FOUND');
    }

    if (job.status !== 'completed' || !job.result) {
      throw new BTAITipsServiceError(
        'Only completed jobs can be applied',
        409,
        'JOB_NOT_APPLICABLE'
      );
    }

    if (job.payload.executionMode !== 'propose_patch') {
      throw new BTAITipsServiceError(
        'Cannot apply a dry_run job',
        409,
        'DRY_RUN_NOT_APPLICABLE'
      );
    }

    if (!job.result.changes.length) {
      throw new BTAITipsServiceError(
        'No changes available to apply',
        409,
        'NO_CHANGES_TO_APPLY'
      );
    }

    for (const change of job.result.changes) {
      await this.applyChange(change, job.payload, appliedBy);
    }

    const now = new Date().toISOString();
    job.appliedAt = now;
    job.updatedAt = now;

    return {
      job,
      appliedCount: job.result.changes.length,
    };
  }

  private async processJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    const startedAt = Date.now();
    job.status = 'processing';
    job.updatedAt = new Date().toISOString();

    try {
      const result = this.buildResult(job.payload, jobId, startedAt);

      job.result = result;
      job.status = result.status === 'blocked' ? 'blocked' : result.status === 'failed' ? 'failed' : 'completed';
      job.updatedAt = new Date().toISOString();

      if (result.status === 'completed') {
        this.metrics.completedJobs += 1;
      } else if (result.status === 'blocked') {
        this.metrics.blockedJobs += 1;
      } else {
        this.metrics.failedJobs += 1;
      }

      if (result.needsHumanReview) {
        this.metrics.manualReviewJobs += 1;
      }

      this.updateLatencyMetrics(result.audit.durationMs);
    } catch (error: any) {
      job.status = 'failed';
      job.error = error?.message || 'Unknown processing error';
      job.updatedAt = new Date().toISOString();
      this.metrics.failedJobs += 1;
      this.updateLatencyMetrics(Date.now() - startedAt);
    }
  }

  private buildResult(payload: BTAITipsPayload, jobId: string, startedAt: number): BTAITipsResult {
    const fieldPath = this.resolveFieldPath(payload);
    const contentType = this.resolveContentType(payload);
    const itemId = this.extractItemId(payload);
    const currentContent = this.extractText(payload.inputData.currentContent);
    let proposed = this.extractText(payload.inputData.proposedContent)
      || this.extractText(payload.inputData.after)
      || this.extractText(payload.inputData.suggestedText);

    if (!proposed && currentContent) {
      proposed = this.deriveSuggestionFromTask(payload, currentContent);
    }

    const qualityChecks: BTAITipsQualityChecks = {
      rulesPassed: [],
      rulesFailed: [],
    };

    if (!fieldPath) {
      qualityChecks.rulesFailed.push('missingFieldPath');
    }

    if (!proposed) {
      qualityChecks.rulesFailed.push('insufficientData');
    }

    if (proposed) {
      proposed = this.applyAcceptanceRules(payload, proposed, qualityChecks);
    }

    const riskLevel = this.getRiskLevel(payload.interventionType);
    const { needsHumanReview, humanReviewReasons } = this.getReviewPolicy(payload.interventionType);
    const durationMs = Date.now() - startedAt;
    const promptHash = this.hashForAudit(payload);

    if (qualityChecks.rulesFailed.length > 0 || !fieldPath || !proposed) {
      return {
        status: 'blocked',
        jobId,
        contractVersion: payload.contractVersion || BT_AI_TIPS_CONTRACT_VERSION,
        interventionType: payload.interventionType,
        taskType: payload.taskType,
        summary: 'Richiesta valida ma non applicabile automaticamente',
        changes: [],
        qualityChecks,
        riskLevel,
        needsHumanReview: true,
        humanReviewReasons: [...humanReviewReasons, 'Dati non sufficienti o vincoli non rispettati'],
        audit: {
          promptHash,
          processedAt: new Date().toISOString(),
          durationMs,
        },
      };
    }

    const change: BTAITipsChange = {
      changeType: 'replace',
      target: {
        scopeType: payload.targetScope.scopeType,
        siteId: payload.targetScope.siteId,
        sectionId: payload.targetScope.sectionId,
        pageId: payload.targetScope.pageId,
        url: payload.targetScope.url,
        componentRef: payload.targetScope.componentRef,
        field: fieldPath,
        contentType: contentType || undefined,
        itemId: itemId !== null && Number.isFinite(itemId) ? itemId : undefined,
      },
      before: currentContent,
      after: proposed,
    };

    if (typeof payload.acceptanceRules.maxChanges === 'number') {
      if (payload.acceptanceRules.maxChanges >= 1) {
        qualityChecks.rulesPassed.push('maxChanges');
      } else {
        qualityChecks.rulesFailed.push('maxChanges');
      }
    }

    if (qualityChecks.rulesFailed.length > 0) {
      return {
        status: 'blocked',
        jobId,
        contractVersion: payload.contractVersion || BT_AI_TIPS_CONTRACT_VERSION,
        interventionType: payload.interventionType,
        taskType: payload.taskType,
        summary: 'Risultato bloccato per violazione regole hard',
        changes: [],
        qualityChecks,
        riskLevel,
        needsHumanReview: true,
        humanReviewReasons: [...humanReviewReasons, 'Violazione acceptanceRules'],
        audit: {
          promptHash,
          processedAt: new Date().toISOString(),
          durationMs,
        },
      };
    }

    return {
      status: 'completed',
      jobId,
      contractVersion: payload.contractVersion || BT_AI_TIPS_CONTRACT_VERSION,
      interventionType: payload.interventionType,
      taskType: payload.taskType,
      summary: this.buildSummary(payload.taskType, proposed),
      changes: [change],
      qualityChecks,
      riskLevel,
      needsHumanReview,
      humanReviewReasons,
      audit: {
        promptHash,
        processedAt: new Date().toISOString(),
        durationMs,
      },
    };
  }

  private enforcePayloadSize(payloadInput: unknown): void {
    const maxKb = Number.parseInt(process.env.BT_AI_TIPS_MAX_PAYLOAD_KB || '128', 10);
    const maxBytes = Number.isFinite(maxKb) && maxKb > 0 ? maxKb * 1024 : 128 * 1024;
    const payloadBytes = Buffer.byteLength(JSON.stringify(payloadInput || {}), 'utf8');

    if (payloadBytes > maxBytes) {
      throw new BTAITipsServiceError(
        `Payload too large (${payloadBytes} bytes), max allowed is ${maxBytes}`,
        413,
        'PAYLOAD_TOO_LARGE'
      );
    }
  }

  private enforceTenantIsolation(siteId: string): void {
    const allowed = (process.env.BT_AI_TIPS_ALLOWED_SITE_IDS || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (allowed.length > 0 && !allowed.includes(siteId)) {
      throw new BTAITipsServiceError(
        `siteId ${siteId} is not allowed`,
        403,
        'TENANT_NOT_ALLOWED'
      );
    }
  }

  private enforceRateLimit(siteId: string): void {
    const limit = Number.parseInt(process.env.BT_AI_TIPS_RATE_LIMIT_PER_MINUTE || '30', 10);
    const maxPerMinute = Number.isFinite(limit) && limit > 0 ? limit : 30;
    const now = Date.now();
    const bucket = this.rateLimitStore.get(siteId);

    if (!bucket || now - bucket.windowStart >= 60_000) {
      this.rateLimitStore.set(siteId, { windowStart: now, count: 1 });
      return;
    }

    if (bucket.count >= maxPerMinute) {
      throw new BTAITipsServiceError(
        `Rate limit exceeded for site ${siteId}`,
        429,
        'RATE_LIMIT_EXCEEDED'
      );
    }

    bucket.count += 1;
    this.rateLimitStore.set(siteId, bucket);
  }

  private buildIdempotencyKey(siteId: string, idempotencyKey: string): string {
    return `${siteId}:${idempotencyKey}`;
  }

  private updateLatencyMetrics(latencyMs: number): void {
    this.totalLatencyMs += latencyMs;
    if (this.metrics.totalJobs > 0) {
      this.metrics.avgLatencyMs = Math.round(this.totalLatencyMs / this.metrics.totalJobs);
    }
  }

  private resolveFieldPath(payload: BTAITipsPayload): string | null {
    const inputField = typeof payload.inputData.fieldPath === 'string'
      ? payload.inputData.fieldPath.trim()
      : '';

    if (inputField) {
      return this.normalizeFieldPath(inputField);
    }

    const fallback = TASK_DEFAULT_FIELD[payload.taskType] || 'content';
    return this.normalizeFieldPath(fallback);
  }

  private resolveContentType(payload: BTAITipsPayload): ContentType | null {
    const inputType = typeof payload.inputData.contentType === 'string'
      ? payload.inputData.contentType.trim()
      : '';

    const normalizedInput = this.normalizeContentType(inputType);
    if (normalizedInput) {
      return normalizedInput;
    }

    if (payload.targetScope.pageId) {
      const fromPageId = this.normalizeContentType(payload.targetScope.pageId);
      if (fromPageId) {
        return fromPageId;
      }
    }

    if (payload.targetScope.url) {
      const lowerUrl = payload.targetScope.url.toLowerCase();
      if (lowerUrl.includes('/storia')) return 'pages/storia';
      if (lowerUrl.endsWith('/') || lowerUrl.includes('/home')) return 'pages/home';
      if (lowerUrl.includes('/news') || lowerUrl.includes('/blog')) return 'news';
    }

    return null;
  }

  private normalizeContentType(value: string): ContentType | null {
    if (!value) return null;

    const normalized = value.trim().toLowerCase();

    if (VALID_CONTENT_TYPES.includes(normalized as ContentType)) {
      return normalized as ContentType;
    }

    if (normalized === 'home' || normalized === 'pages_home') return 'pages/home';
    if (normalized === 'storia' || normalized === 'pages_storia') return 'pages/storia';
    if (normalized === 'posts' || normalized === 'post') return 'news';

    return null;
  }

  private extractItemId(payload: BTAITipsPayload): number | null {
    const candidate = payload.inputData.itemId ?? payload.inputData.contentId;
    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
      return candidate;
    }
    if (typeof candidate === 'string' && candidate.trim()) {
      const parsed = Number.parseInt(candidate.trim(), 10);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }

  private extractText(value: unknown): string | null {
    if (typeof value === 'string') {
      const normalized = this.normalizeWhitespace(value);
      return normalized || null;
    }

    if (Array.isArray(value)) {
      const joined = value.map((item) => String(item)).join(' ');
      const normalized = this.normalizeWhitespace(joined);
      return normalized || null;
    }

    return null;
  }

  private normalizeWhitespace(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  private deriveSuggestionFromTask(payload: BTAITipsPayload, current: string): string | null {
    switch (payload.taskType) {
      case 'OPTIMIZE_TITLE':
        return this.truncate(current, this.getMaxTitleLength(payload));
      case 'OPTIMIZE_META_DESCRIPTION':
        return this.buildMetaDescription(current, this.getMaxMetaDescriptionLength(payload));
      case 'SUMMARIZE_SECTION':
        return this.summarizeText(current, 180);
      case 'IMPROVE_READABILITY':
      case 'SIMPLIFY_LANGUAGE':
      case 'REWRITE_BLOCK':
      case 'ALIGN_TONE':
      case 'NORMALIZE_TERMINOLOGY':
        return this.simplifyText(current);
      case 'REWRITE_CTA':
        return this.rewriteCTA(current);
      default:
        return null;
    }
  }

  private getMaxTitleLength(payload: BTAITipsPayload): number {
    const value = Number(payload.acceptanceRules.maxTitleLength);
    return Number.isFinite(value) && value > 0 ? value : 60;
  }

  private getMaxMetaDescriptionLength(payload: BTAITipsPayload): number {
    const value = Number(payload.acceptanceRules.maxMetaDescriptionLength);
    return Number.isFinite(value) && value > 0 ? value : 155;
  }

  private summarizeText(text: string, maxLen: number): string {
    const sentence = text.split(/[.!?]/).find((chunk) => chunk.trim().length > 0)?.trim() || text;
    return this.truncate(sentence, maxLen);
  }

  private buildMetaDescription(text: string, maxLen: number): string {
    const summary = this.summarizeText(text, maxLen);
    if (summary.length <= maxLen) {
      return summary;
    }
    return this.truncate(summary, maxLen);
  }

  private simplifyText(text: string): string {
    const normalized = this.normalizeWhitespace(text);
    return normalized.replace(/,\s+/g, '. ').replace(/\s{2,}/g, ' ');
  }

  private rewriteCTA(text: string): string {
    const normalized = this.normalizeWhitespace(text);
    if (!normalized) {
      return 'Scopri di piu e richiedi informazioni.';
    }
    if (/scopri|richiedi|prenota|contatta/i.test(normalized)) {
      return normalized;
    }
    return `Scopri di piu: ${this.truncate(normalized, 80)}`;
  }

  private truncate(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;
    const safeSlice = text.slice(0, Math.max(maxLen - 1, 1));
    return `${safeSlice.trimEnd()}...`;
  }

  private applyAcceptanceRules(
    payload: BTAITipsPayload,
    proposedText: string,
    checks: BTAITipsQualityChecks
  ): string {
    let output = proposedText;

    if (payload.taskType === 'OPTIMIZE_TITLE') {
      const maxLen = this.getMaxTitleLength(payload);
      if (output.length > maxLen) {
        output = this.truncate(output, maxLen);
      }
      checks.rulesPassed.push('maxTitleLength');
    }

    if (payload.taskType === 'OPTIMIZE_META_DESCRIPTION') {
      const maxLen = this.getMaxMetaDescriptionLength(payload);
      if (output.length > maxLen) {
        output = this.truncate(output, maxLen);
      }
      checks.rulesPassed.push('maxMetaDescriptionLength');
    }

    const forbiddenTerms = Array.isArray(payload.acceptanceRules.forbiddenTerms)
      ? payload.acceptanceRules.forbiddenTerms.filter((term: unknown) => typeof term === 'string')
      : [];

    if (forbiddenTerms.length > 0) {
      const lowerOutput = output.toLowerCase();
      const violated = forbiddenTerms.find((term: string) => lowerOutput.includes(term.toLowerCase()));
      if (violated) {
        checks.rulesFailed.push(`forbiddenTerms:${violated}`);
      } else {
        checks.rulesPassed.push('forbiddenTerms');
      }
    }

    return output;
  }

  private getRiskLevel(interventionType: BTInterventionType): BTAITipsRiskLevel {
    switch (interventionType) {
      case 'SEO_ONPAGE':
      case 'CONVERSION_CRO':
      case 'CONTENT_GOVERNANCE':
        return 'high';
      case 'CONTENT_QUALITY':
      case 'ACCESSIBILITY_COMPLIANCE':
        return 'medium';
      case 'BRAND_VOICE':
      default:
        return 'low';
    }
  }

  private getReviewPolicy(interventionType: BTInterventionType): {
    needsHumanReview: boolean;
    humanReviewReasons: string[];
  } {
    if (REVIEW_REQUIRED.has(interventionType)) {
      return {
        needsHumanReview: true,
        humanReviewReasons: ['Review umana obbligatoria per questa categoria di intervento'],
      };
    }

    if (REVIEW_RECOMMENDED.has(interventionType)) {
      return {
        needsHumanReview: true,
        humanReviewReasons: ['Review umana consigliata prima dell apply'],
      };
    }

    return {
      needsHumanReview: false,
      humanReviewReasons: [],
    };
  }

  private hashForAudit(payload: BTAITipsPayload): string {
    const digest = crypto
      .createHash('sha256')
      .update(JSON.stringify(payload))
      .digest('hex');
    return `sha256:${digest}`;
  }

  private buildSummary(taskType: BTTaskType, after: string): string {
    const preview = this.truncate(after, 90);
    return `${taskType}: proposta aggiornata -> ${preview}`;
  }

  private normalizeFieldPath(fieldPath: string): string {
    let normalized = fieldPath.trim();

    if (normalized.startsWith('$.')) {
      normalized = normalized.slice(2);
    }

    return normalized;
  }

  private async applyChange(change: BTAITipsChange, payload: BTAITipsPayload, appliedBy: string): Promise<void> {
    const contentType = change.target.contentType || this.resolveContentType(payload);
    if (!contentType) {
      throw new BTAITipsServiceError(
        'Missing contentType for apply operation',
        400,
        'MISSING_CONTENT_TYPE'
      );
    }

    const fieldPath = change.target.field;
    if (!fieldPath) {
      throw new BTAITipsServiceError('Missing target field', 400, 'MISSING_TARGET_FIELD');
    }

    if (contentType === 'settings' || contentType.startsWith('pages/')) {
      await contentService.updateFields(contentType, fieldPath, change.after, appliedBy);
      return;
    }

    const itemId = change.target.itemId;
    if (typeof itemId !== 'number' || !Number.isFinite(itemId)) {
      throw new BTAITipsServiceError(
        'itemId is required for list content types',
        400,
        'MISSING_ITEM_ID'
      );
    }

    await this.applyToArrayContent(contentType, itemId, fieldPath, change.after, appliedBy);
  }

  private async applyToArrayContent(
    contentType: ContentType,
    itemId: number,
    fieldPath: string,
    value: string,
    appliedBy: string
  ): Promise<void> {
    const data = await contentService.read<any>(contentType);
    const key = contentType.replace('pages/', '');
    const items = data[key];

    if (!Array.isArray(items)) {
      throw new BTAITipsServiceError(
        `Content type ${contentType} does not contain an array`,
        400,
        'INVALID_CONTENT_STRUCTURE'
      );
    }

    const index = items.findIndex((item: any) => Number(item?.id) === itemId);
    if (index < 0) {
      throw new BTAITipsServiceError(
        `Item ${itemId} not found in ${contentType}`,
        404,
        'ITEM_NOT_FOUND'
      );
    }

    this.setByPath(items[index], fieldPath, value);
    data[key] = items;
    await contentService.write(contentType, data, appliedBy);
  }

  private setByPath(target: Record<string, any>, fieldPath: string, value: any): void {
    const parts = fieldPath.split('.').filter(Boolean);
    if (parts.length === 0) return;

    let current: Record<string, any> = target;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part] as Record<string, any>;
    }

    current[parts[parts.length - 1]] = value;
  }
}

export const btAiTipsService = new BTAITipsService();
