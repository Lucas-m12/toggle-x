import { AppError } from '@/core/errors/app-error';

export class UserNotApprovedError extends AppError {
  constructor() {
    super('User has not been approved yet');
    this.name = 'UserNotApprovedError';
  }
}
