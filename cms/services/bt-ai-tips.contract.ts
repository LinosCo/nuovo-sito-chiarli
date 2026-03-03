export const BT_AI_TIPS_CONTRACT_VERSION = '1.0.0';

export const INTERVENTION_TYPES = [
  'CONTENT_QUALITY',
  'SEO_ONPAGE',
  'CONVERSION_CRO',
  'ACCESSIBILITY_COMPLIANCE',
  'BRAND_VOICE',
  'CONTENT_GOVERNANCE',
] as const;

export type BTInterventionType = typeof INTERVENTION_TYPES[number];

export const TASK_TYPES = [
  'REWRITE_BLOCK',
  'EXPAND_SECTION',
  'SUMMARIZE_SECTION',
  'IMPROVE_READABILITY',
  'LOCALIZE_COPY',
  'ALIGN_TONE',
  'OPTIMIZE_TITLE',
  'OPTIMIZE_META_DESCRIPTION',
  'OPTIMIZE_H1_H2',
  'ADD_INTERNAL_LINKS',
  'IMPROVE_ENTITY_COVERAGE',
  'REWRITE_CTA',
  'REFINE_VALUE_PROP',
  'SIMPLIFY_FORM_COPY',
  'ADD_TRUST_ELEMENTS',
  'REDUCE_FRICTION_COPY',
  'SIMPLIFY_LANGUAGE',
  'ADD_IMAGE_ALT_TEXT',
  'FIX_LINK_TEXT_CLARITY',
  'IMPROVE_HEADING_STRUCTURE',
  'APPLY_STYLE_GUIDE',
  'NORMALIZE_TERMINOLOGY',
  'DETECT_DUPLICATE_CONTENT',
  'STANDARDIZE_SECTIONS',
  'FLAG_STALE_CONTENT',
  'ENFORCE_LEGAL_DISCLAIMER',
] as const;

export type BTTaskType = typeof TASK_TYPES[number];
export type BTPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type BTExecutionMode = 'dry_run' | 'propose_patch';
export type BTScopeType = 'SITE' | 'SECTION' | 'PAGE' | 'COMPONENT';

export interface BTTargetScope {
  scopeType: BTScopeType;
  siteId: string;
  sectionId?: string;
  pageId?: string;
  url?: string;
  componentRef?: string;
}

export interface BTAITipsPayload {
  contractVersion: string;
  siteId: string;
  locale: string;
  interventionType: BTInterventionType;
  taskType: BTTaskType;
  priority: BTPriority;
  targetScope: BTTargetScope;
  inputData: Record<string, any>;
  acceptanceRules: Record<string, any>;
  executionMode: BTExecutionMode;
  metadata: Record<string, any>;
}

export interface BTAITipsValidationResult {
  valid: boolean;
  errors: string[];
  payload?: BTAITipsPayload;
}

const TASKS_BY_INTERVENTION: Record<BTInterventionType, BTTaskType[]> = {
  CONTENT_QUALITY: [
    'REWRITE_BLOCK',
    'EXPAND_SECTION',
    'SUMMARIZE_SECTION',
    'IMPROVE_READABILITY',
    'LOCALIZE_COPY',
  ],
  SEO_ONPAGE: [
    'OPTIMIZE_TITLE',
    'OPTIMIZE_META_DESCRIPTION',
    'OPTIMIZE_H1_H2',
    'ADD_INTERNAL_LINKS',
    'IMPROVE_ENTITY_COVERAGE',
  ],
  CONVERSION_CRO: [
    'REWRITE_CTA',
    'ADD_TRUST_ELEMENTS',
    'REFINE_VALUE_PROP',
    'SIMPLIFY_FORM_COPY',
    'REDUCE_FRICTION_COPY',
  ],
  ACCESSIBILITY_COMPLIANCE: [
    'SIMPLIFY_LANGUAGE',
    'ADD_IMAGE_ALT_TEXT',
    'FIX_LINK_TEXT_CLARITY',
    'IMPROVE_HEADING_STRUCTURE',
  ],
  BRAND_VOICE: [
    'ALIGN_TONE',
    'APPLY_STYLE_GUIDE',
    'NORMALIZE_TERMINOLOGY',
  ],
  CONTENT_GOVERNANCE: [
    'DETECT_DUPLICATE_CONTENT',
    'STANDARDIZE_SECTIONS',
    'FLAG_STALE_CONTENT',
    'ENFORCE_LEGAL_DISCLAIMER',
  ],
};

const PRIORITIES: BTPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const EXECUTION_MODES: BTExecutionMode[] = ['dry_run', 'propose_patch'];
const SCOPES: BTScopeType[] = ['SITE', 'SECTION', 'PAGE', 'COMPONENT'];

function asObject(value: unknown): Record<string, any> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, any>;
}

function toUpper(value: unknown): string {
  return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

export function validateBTAITipsPayload(input: unknown): BTAITipsValidationResult {
  const errors: string[] = [];
  const body = asObject(input);

  if (!body) {
    return { valid: false, errors: ['Payload must be a JSON object'] };
  }

  const siteId = typeof body.siteId === 'string' ? body.siteId.trim() : '';
  const locale = typeof body.locale === 'string' ? body.locale.trim() : 'it-IT';
  const interventionType = toUpper(body.interventionType) as BTInterventionType;
  const taskType = toUpper(body.taskType) as BTTaskType;
  const priority = toUpper(body.priority || 'MEDIUM') as BTPriority;
  const executionMode = typeof body.executionMode === 'string'
    ? body.executionMode.trim().toLowerCase() as BTExecutionMode
    : 'dry_run';
  const contractVersion = typeof body.contractVersion === 'string' && body.contractVersion.trim()
    ? body.contractVersion.trim()
    : BT_AI_TIPS_CONTRACT_VERSION;

  const targetScopeRaw = asObject(body.targetScope);
  const inputData = asObject(body.inputData) || {};
  const acceptanceRules = asObject(body.acceptanceRules) || {};
  const metadata = asObject(body.metadata) || {};

  if (!siteId) {
    errors.push('siteId is required');
  }

  if (!INTERVENTION_TYPES.includes(interventionType)) {
    errors.push(`interventionType must be one of: ${INTERVENTION_TYPES.join(', ')}`);
  }

  if (!TASK_TYPES.includes(taskType)) {
    errors.push(`taskType must be one of: ${TASK_TYPES.join(', ')}`);
  }

  if (INTERVENTION_TYPES.includes(interventionType) && TASK_TYPES.includes(taskType)) {
    if (!TASKS_BY_INTERVENTION[interventionType].includes(taskType)) {
      errors.push(`taskType ${taskType} is not valid for interventionType ${interventionType}`);
    }
  }

  if (!PRIORITIES.includes(priority)) {
    errors.push(`priority must be one of: ${PRIORITIES.join(', ')}`);
  }

  if (!EXECUTION_MODES.includes(executionMode)) {
    errors.push(`executionMode must be one of: ${EXECUTION_MODES.join(', ')}`);
  }

  if (!targetScopeRaw) {
    errors.push('targetScope is required and must be an object');
  }

  const scopeType = toUpper(targetScopeRaw?.scopeType) as BTScopeType;
  const targetSiteId = typeof targetScopeRaw?.siteId === 'string' ? targetScopeRaw.siteId.trim() : '';
  const sectionId = typeof targetScopeRaw?.sectionId === 'string' ? targetScopeRaw.sectionId.trim() : undefined;
  const pageId = typeof targetScopeRaw?.pageId === 'string' ? targetScopeRaw.pageId.trim() : undefined;
  const url = typeof targetScopeRaw?.url === 'string' ? targetScopeRaw.url.trim() : undefined;
  const componentRef = typeof targetScopeRaw?.componentRef === 'string' ? targetScopeRaw.componentRef.trim() : undefined;

  if (!SCOPES.includes(scopeType)) {
    errors.push(`targetScope.scopeType must be one of: ${SCOPES.join(', ')}`);
  }

  if (!targetSiteId) {
    errors.push('targetScope.siteId is required');
  } else if (siteId && targetSiteId !== siteId) {
    errors.push('targetScope.siteId must match siteId');
  }

  if (!locale) {
    errors.push('locale is required');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const payload: BTAITipsPayload = {
    contractVersion,
    siteId,
    locale,
    interventionType,
    taskType,
    priority,
    targetScope: {
      scopeType,
      siteId: targetSiteId,
      sectionId,
      pageId,
      url,
      componentRef,
    },
    inputData,
    acceptanceRules,
    executionMode,
    metadata,
  };

  return { valid: true, errors: [], payload };
}

