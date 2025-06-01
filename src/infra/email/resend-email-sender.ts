import { EmailSender } from '@/app/ports/email-sender';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const tenantFromMap: Record<string, string> = {
  default: 'Toggle-X <no-reply@togglex.app>',
  'tenant-1': 'XPTO <contato@xpto.com>',
};

export class ResendEmailSender implements EmailSender {

  async sendEmail(input: {
    tenantId: string;
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    const from = tenantFromMap[input.tenantId] || tenantFromMap.default;
    await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
  }
}
