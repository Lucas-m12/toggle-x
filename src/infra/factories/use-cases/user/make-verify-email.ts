import { VerifyEmailUseCase } from "@/app/user/verify-email-use-case";
import { InMemoryEmailVerificationTokenStore } from "@/infra/auth/adapters/in-memory-email-verification-token-store";
import { db } from "@/infra/db/client";
import { DrizzleUserRepository } from "@/infra/db/repositories/drizzle-user-repository";


export function makeVerifyEmailUseCase() {
  const userRepository = new DrizzleUserRepository(db);
  const tokenStore = new InMemoryEmailVerificationTokenStore();

  return new VerifyEmailUseCase(userRepository, tokenStore);
}
