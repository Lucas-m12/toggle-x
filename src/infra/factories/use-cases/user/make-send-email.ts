import { SendVerificationEmailUseCase } from "@/app/user/send-verification-email";
import { InMemoryEmailVerificationTokenStore } from "@/infra/auth/adapters/in-memory-email-verification-token-store";
import { db } from "@/infra/db/client";
import { DrizzleUserRepository } from "@/infra/db/repositories/drizzle-user-repository";
import { ResendEmailSender } from "@/infra/email/resend-email-sender";


export function makeSendVerificationEmailUseCase() {
  const userRepository = new DrizzleUserRepository(db);
  const emailSender = new ResendEmailSender();
  const tokenStore = new InMemoryEmailVerificationTokenStore(); // pode ser trocado depois

  return new SendVerificationEmailUseCase(
    userRepository,
    emailSender,
    tokenStore,
  );
}


