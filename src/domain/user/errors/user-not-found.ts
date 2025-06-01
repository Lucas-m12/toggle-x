import { AppError } from '@/core/errors/app-error';

export class UserNotFoundError extends AppError {
  constructor() {
    super('User not found');
    this.name = 'UserNotFoundError';
  }
}
