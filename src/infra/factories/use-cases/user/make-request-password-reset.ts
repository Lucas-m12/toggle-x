import { RequestPasswordResetUseCase } from '@/app/user/request-password-use-case';
import { RedisPasswordResetTokenStore } from '@/infra/auth/adapters/redis-password-reset-token-store';
import { db } from '@/infra/db/client';
import { DrizzleUserRepository } from '@/infra/db/repositories/drizzle-user-repository';
import { ResendEmailSender } from '@/infra/email/resend-email-sender';
import { redis } from '@/infra/redis/redis-client';

export function makeRequestPasswordResetUseCase(): RequestPasswordResetUseCase {
  const userRepository = new DrizzleUserRepository(db);
  const tokenStore = new RedisPasswordResetTokenStore(redis);
  const emailSender = new ResendEmailSender();

  return new RequestPasswordResetUseCase(
    userRepository,
    tokenStore,
    emailSender,
  );
}
