import { UserNotFoundError } from "@/domain/user/errors/user-not-found";
import { UserRepository } from "@/domain/user/repositories/user-repository";
import { EmailSender } from "../ports/email-sender";
import { PasswordResetTokenStore } from "../ports/password-reset-token-store";


interface RequestPasswordResetInput {
  tenantId: string;
  email: string;
  baseUrl: string;
}

export class RequestPasswordResetUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly tokenStore: PasswordResetTokenStore,
    private readonly emailSender: EmailSender,
  ) {}

  async execute(input: RequestPasswordResetInput): Promise<void> {
    const user = await this.users.findByEmail(input.tenantId, input.email);
    if (!user) throw new UserNotFoundError();
    const token = await this.tokenStore.generate(user.id);
    const link = `${input.baseUrl}/auth/reset-password?token=${token}`;
    const html = `<p>Olá, ${user.name}!</p><p>Você solicitou a redefinição de senha. Clique no link abaixo:</p><p><a href="${link}">${link}</a></p>`;

    await this.emailSender.sendEmail({
      tenantId: input.tenantId,
      to: user.email,
      subject: 'Redefinição de senha',
      html,
    });
  }
}
