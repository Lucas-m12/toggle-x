import { AppError } from '@/core/errors/app-error';

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super('User already exists');
    this.name = 'UserAlreadyExistsError';
  }
}
