import { AppError } from '@/core/errors/app-error';

export class EmailNotVerifiedError extends AppError {
  constructor() {
    super('Email has not been verified yet');
    this.name = 'EmailNotVerifiedError';
  }
}
