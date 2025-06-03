import { ResetPasswordUseCase } from '@/app/user/reset-password-use-case';
import { BcryptHasher } from '@/infra/auth/adapters/bcrypt-hasher';
import { RedisPasswordResetTokenStore } from '@/infra/auth/adapters/redis-password-reset-token-store';
import { db } from '@/infra/db/client';
import { DrizzleUserRepository } from '@/infra/db/repositories/drizzle-user-repository';
import { redis } from '@/infra/redis/redis-client';

export function makeResetPasswordUseCase(): ResetPasswordUseCase {
  const userRepository = new DrizzleUserRepository(db);
  const tokenStore = new RedisPasswordResetTokenStore(redis);
  const hasher = new BcryptHasher();

  return new ResetPasswordUseCase(userRepository, tokenStore, hasher);
}
