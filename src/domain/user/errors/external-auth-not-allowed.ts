import { AppError } from '@/core/errors/app-error';

export class ExternalAuthNotAllowedError extends AppError {
  constructor() {
    super('this tenant uses external authentication (SSO)');
    this.name = 'ExternalAuthNotAllowedError';
  }
}
