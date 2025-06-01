import { RequestPasswordResetUseCase } from '@/app/user/request-password-use-case';
import { InMemoryPasswordResetTokenStore } from '@/infra/auth/adapters/in-memory-password-reset-token-store';
import { db } from '@/infra/db/client';
import { DrizzleUserRepository } from '@/infra/db/repositories/drizzle-user-repository';
import { ResendEmailSender } from '@/infra/email/resend-email-sender';

export function makeRequestPasswordResetUseCase(): RequestPasswordResetUseCase {
  const userRepository = new DrizzleUserRepository(db);
  const tokenStore = new InMemoryPasswordResetTokenStore();
  const emailSender = new ResendEmailSender();

  return new RequestPasswordResetUseCase(
    userRepository,
    tokenStore,
    emailSender,
  );
}
