export interface EmailSender {
  sendEmail(input: {
    tenantId: string;
    to: string;
    subject: string;
    html: string;
  }): Promise<void>;
}
