import { AppError } from '@/core/errors/app-error';

export class EmailAlreadyVerifiedError extends AppError {
  constructor() {
    super('Email already verified');
    this.name = 'EmailAlreadyVerifiedError';
  }
}
