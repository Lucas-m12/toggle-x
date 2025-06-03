import { VerifyEmailUseCase } from "@/app/user/verify-email-use-case";
import { RedisEmailVerificationTokenStore } from "@/infra/auth/adapters/redis-email-verification-token-store";
import { db } from "@/infra/db/client";
import { DrizzleUserRepository } from "@/infra/db/repositories/drizzle-user-repository";
import { redis } from "@/infra/redis/redis-client";

export function makeVerifyEmailUseCase() {
  const userRepository = new DrizzleUserRepository(db);
  const tokenStore = new RedisEmailVerificationTokenStore(redis);

  return new VerifyEmailUseCase(userRepository, tokenStore);
}
