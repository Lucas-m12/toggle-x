import { ResetPasswordUseCase } from '@/app/user/reset-password-use-case';
import { BcryptHasher } from '@/infra/auth/adapters/bcrypt-hasher';
import { InMemoryPasswordResetTokenStore } from '@/infra/auth/adapters/in-memory-password-reset-token-store';
import { db } from '@/infra/db/client';
import { DrizzleUserRepository } from '@/infra/db/repositories/drizzle-user-repository';

export function makeResetPasswordUseCase(): ResetPasswordUseCase {
  const userRepository = new DrizzleUserRepository(db);
  const tokenStore = new InMemoryPasswordResetTokenStore();
  const hasher = new BcryptHasher();

  return new ResetPasswordUseCase(userRepository, tokenStore, hasher);
}
