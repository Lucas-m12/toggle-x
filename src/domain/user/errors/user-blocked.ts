import { AppError } from '@/core/errors/app-error';

export class UserBlockedError extends AppError {
  constructor() {
    super('User is blocked');
    this.name = 'UserBlockedError';
  }
}
