import { UserRegisteredEvent } from "@/domain/user/events/user-registered";
import { SendVerificationEmailUseCase } from "../send-verification-email";


export class OnUserRegisteredSendEmailVerification {
  constructor(
    private readonly sendVerificationEmail: SendVerificationEmailUseCase,
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    await this.sendVerificationEmail.execute({
      tenantId: event.tenantId,
      email: event.email,
      baseUrl: process.env.APP_BASE_URL || 'https://app.togglex.com',
    });
  }
}
