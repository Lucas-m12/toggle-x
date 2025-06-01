import { InvalidOrExpiredTokenError } from '@/domain/user/errors/InvalidOrExpiredToken';
import { UserNotFoundError } from '@/domain/user/errors/user-not-found';
import { UserRepository } from '@/domain/user/repositories/user-repository';
import { EmailVerificationTokenStore } from '../ports/email-verification-token-store';

export class VerifyEmailUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly tokenStore: EmailVerificationTokenStore,
  ) {}

  async execute(input: { token: string }): Promise<void> {
    const userId = await this.tokenStore.validate(input.token);
    if (!userId) throw new InvalidOrExpiredTokenError();
    const user = await this.users.findById(userId);
    if (!user) throw new UserNotFoundError();
    user.markEmailAsVerified();
    await this.users.verifyEmail(user.id);
  }
}
