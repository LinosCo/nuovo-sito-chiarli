import { Request, Response } from 'express';
import { btAiTipsService, BTAITipsServiceError } from '../services/bt-ai-tips.service.js';

function readHeaderValue(value: string | string[] | undefined): string | undefined {
  if (typeof value === 'string') {
    const normalized = value.trim();
    return normalized || undefined;
  }
  if (Array.isArray(value) && value[0]) {
    const normalized = value[0].trim();
    return normalized || undefined;
  }
  return undefined;
}

function handleError(error: unknown, res: Response): void {
  if (error instanceof BTAITipsServiceError) {
    res.status(error.statusCode).json({
      error: error.code,
      message: error.message,
    });
    return;
  }

  const generic = error as Error;
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: generic?.message || 'Unexpected error',
  });
}

export class BTAITipsController {
  async createJob(req: Request, res: Response): Promise<void> {
    try {
      const idempotencyKey = readHeaderValue(req.headers['x-idempotency-key']);
      const { job, duplicated } = await btAiTipsService.createJob(req.body, idempotencyKey);

      res.status(duplicated ? 200 : 202).json({
        status: job.status,
        jobId: job.jobId,
        duplicated,
        contractVersion: job.payload.contractVersion,
        createdAt: job.createdAt,
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async getJob(req: Request, res: Response): Promise<void> {
    try {
      const jobId = req.params.jobId;
      const job = btAiTipsService.getJob(jobId);

      if (!job) {
        res.status(404).json({
          error: 'JOB_NOT_FOUND',
          message: 'Job not found',
        });
        return;
      }

      res.json({
        status: job.status,
        jobId: job.jobId,
        contractVersion: job.payload.contractVersion,
        result: job.result || null,
        error: job.error || null,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        appliedAt: job.appliedAt || null,
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async applyJob(req: Request, res: Response): Promise<void> {
    try {
      const jobId = req.params.jobId;
      const appliedBy = typeof req.body?.appliedBy === 'string' && req.body.appliedBy.trim()
        ? req.body.appliedBy.trim()
        : 'bt-ai-tips';

      const { job, appliedCount } = await btAiTipsService.applyJob(jobId, appliedBy);

      res.json({
        success: true,
        jobId: job.jobId,
        status: job.status,
        appliedAt: job.appliedAt,
        appliedCount,
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      res.json(btAiTipsService.getMetrics());
    } catch (error) {
      handleError(error, res);
    }
  }
}

export const btAiTipsController = new BTAITipsController();

