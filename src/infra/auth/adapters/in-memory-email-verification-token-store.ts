import { EmailVerificationTokenStore } from '@/app/ports/email-verification-token-store';
import crypto from 'crypto';

export class InMemoryEmailVerificationTokenStore
  implements EmailVerificationTokenStore
{
  private store = new Map<string, string>();

  async generate(userId: string): Promise<string> {
    const token = crypto.randomUUID();
    this.store.set(token, userId);
    return token;
  }

  async validate(token: string): Promise<string | null> {
    return this.store.get(token) ?? null;
  }
}
