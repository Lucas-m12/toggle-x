import { describe, expect, it, vi } from 'vitest';

import { EmailAlreadyVerifiedError } from '@/domain/user/errors/email-already-verified';
import { InvalidOrExpiredTokenError } from '@/domain/user/errors/InvalidOrExpiredToken';
import { UserNotFoundError } from '@/domain/user/errors/user-not-found';
import { UserFactory } from '@/domain/user/factories/user-factory';
import { InMemoryUserRepository } from '@/infra/db/repositories/in-memory/in-memory-user-repository';
import { VerifyEmailUseCase } from './verify-email-use-case';

const makeTokenStore = (map = new Map<string, string>()) => ({
  generate: vi.fn((userId: string) => {
    const token = `token-${userId}`;
    map.set(token, userId);
    return Promise.resolve(token);
  }),
  validate: vi.fn((token: string) => {
    return Promise.resolve(map.get(token) ?? null);
  }),
});

describe('VerifyEmailUseCase', () => {
  it('should verify user email with valid token', async () => {
    const repo = new InMemoryUserRepository();
    const tokenMap = new Map<string, string>();
    const tokenStore = makeTokenStore(tokenMap);

    const user = UserFactory.createInternalUser({
      tenantId: 'tenant-1',
      name: 'Lucas',
      email: 'lucas@example.com',
      password: 'hashed',
    });

    await repo.create(user);
    const token = await tokenStore.generate(user.id);

    const useCase = new VerifyEmailUseCase(repo, tokenStore);
    await useCase.execute({ token });

    const updated = await repo.findById(user.id);
    expect(updated?.emailVerified).toBe(true);
  });

  it('should throw if token is invalid', async () => {
    const repo = new InMemoryUserRepository();
    const tokenStore = makeTokenStore();

    const useCase = new VerifyEmailUseCase(repo, tokenStore);

    await expect(() =>
      useCase.execute({ token: 'invalid-token' }),
    ).rejects.toThrow(InvalidOrExpiredTokenError);
  });

  it('should throw if user does not exist', async () => {
    const repo = new InMemoryUserRepository();
    const tokenMap = new Map<string, string>();
    const tokenStore = makeTokenStore(tokenMap);

    tokenMap.set('token-x', 'nonexistent-user');

    const useCase = new VerifyEmailUseCase(repo, tokenStore);

    await expect(() => useCase.execute({ token: 'token-x' })).rejects.toThrow(
      UserNotFoundError,
    );
  });

  it('should throw if email already verified', async () => {
    const repo = new InMemoryUserRepository();
    const tokenMap = new Map<string, string>();
    const tokenStore = makeTokenStore(tokenMap);

    const user = UserFactory.createInternalUser({
      tenantId: 'tenant-1',
      name: 'Lucas',
      email: 'lucas@example.com',
      password: 'hashed',
    });
    user.markEmailAsVerified();
    await repo.create(user);

    const token = await tokenStore.generate(user.id);

    const useCase = new VerifyEmailUseCase(repo, tokenStore);

    await expect(() => useCase.execute({ token })).rejects.toThrow(
      EmailAlreadyVerifiedError,
    );
  });
});
