
import { PasswordResetTokenStore } from '@/app/ports/password-reset-token-store';
import crypto from 'crypto';

export class InMemoryPasswordResetTokenStore implements PasswordResetTokenStore {
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
