import { SendVerificationEmailUseCase } from "@/app/user/send-verification-email";
import { RedisEmailVerificationTokenStore } from "@/infra/auth/adapters/redis-email-verification-token-store";
import { db } from "@/infra/db/client";
import { DrizzleUserRepository } from "@/infra/db/repositories/drizzle-user-repository";
import { ResendEmailSender } from "@/infra/email/resend-email-sender";
import { redis } from "@/infra/redis/redis-client";


export function makeSendVerificationEmailUseCase() {
  const userRepository = new DrizzleUserRepository(db);
  const emailSender = new ResendEmailSender();
  const tokenStore = new RedisEmailVerificationTokenStore(redis); // pode ser trocado depois

  return new SendVerificationEmailUseCase(
    userRepository,
    emailSender,
    tokenStore,
  );
}


