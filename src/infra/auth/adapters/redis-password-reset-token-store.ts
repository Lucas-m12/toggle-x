import { PasswordResetTokenStore } from '@/app/ports/password-reset-token-store';
import crypto from 'crypto';
import Redis from 'ioredis';

export class RedisPasswordResetTokenStore implements PasswordResetTokenStore {
  private readonly PREFIX = 'password-reset:';
  private readonly TTL_SECONDS = 60 * 15; // 15 minutos

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
