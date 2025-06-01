import { UserNotFoundError } from '@/domain/user/errors/user-not-found';
import { UserRepository } from '@/domain/user/repositories/user-repository';
import { EmailSender } from '../ports/email-sender';
import { EmailVerificationTokenStore } from '../ports/email-verification-token-store';
import { SendVerificationEmailInput } from './dto/send-verification-email-dto';

export class SendVerificationEmailUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly emailSender: EmailSender,
    private readonly tokenStore: EmailVerificationTokenStore,
  ) {}

  async execute(input: SendVerificationEmailInput): Promise<void> {
    const user = await this.users.findByEmail(input.tenantId, input.email);
    if (!user) {
      throw new UserNotFoundError();
    }
    const token = await this.tokenStore.generate(user.id);
    const link = `${input.baseUrl}/auth/verify-email?token=${token}`;
    const html = `<p>Olá, ${user.name}!</p><p>Confirme seu e-mail clicando no link abaixo:</p><p><a href="${link}">${link}</a></p>`;
    await this.emailSender.sendEmail({
      tenantId: input.tenantId,
      to: user.email,
      subject: 'Confirme seu e-mail',
      html,
    });
  }
}
