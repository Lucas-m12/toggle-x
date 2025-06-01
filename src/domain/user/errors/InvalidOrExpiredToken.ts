import { AppError } from '@/core/errors/app-error';

export class InvalidOrExpiredTokenError extends AppError {
  constructor() {
    super('Invalid or expired token');
    this.name = 'InvalidOrExpiredTokenError';
  }
}
