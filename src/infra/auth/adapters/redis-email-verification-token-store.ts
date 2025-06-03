import { EmailVerificationTokenStore } from '@/app/ports/email-verification-token-store';
import crypto from 'crypto';
import Redis from 'ioredis';

export class RedisEmailVerificationTokenStore implements EmailVerificationTokenStore {
  private readonly PREFIX = 'email-verification:';
  private readonly TTL_SECONDS = 60 * 60;

  constructor(private readonly redis: Redis) {}

  async generate(userId: string): Promise<string> {
    const token = crypto.randomUUID();
    await this.redis.setex(this.PREFIX + token, this.TTL_SECONDS, userId);
    return token;
  }

  async validate(token: string): Promise<string | null> {
    const userId = await this.redis.get(this.PREFIX + token);
    return userId ?? null;
  }
}
