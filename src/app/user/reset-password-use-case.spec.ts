import { InvalidOrExpiredTokenError } from '@/domain/user/errors/InvalidOrExpiredToken';
import { UserNotFoundError } from '@/domain/user/errors/user-not-found';
import { UserFactory } from '@/domain/user/factories/user-factory';
import { InMemoryUserRepository } from '@/infra/db/repositories/in-memory/in-memory-user-repository';
import { describe, expect, it, vi } from 'vitest';
import { ResetPasswordUseCase } from './reset-password-use-case';

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

const makeHasher = () => ({
  hash: vi.fn((value) => {
    return Promise.resolve(`hashed-${value}`);
  }),
  compare: vi.fn((raw, hash) => {
    return Promise.resolve(raw === hash);
  })
});

describe('ResetPasswordUseCase', () => {
  it('should reset password for valid token', async () => {
    const repo = new InMemoryUserRepository();
    const user = UserFactory.createInternalUser({
      tenantId: 'tenant-1',
      name: 'Lucas',
      email: 'lucas@example.com',
      password: 'old-hash',
    });
    await repo.create(user);

    const tokenMap = new Map<string, string>();
    const tokenStore = makeTokenStore(tokenMap);
    const token = await tokenStore.generate(user.id);

    const hasher = makeHasher();
    const useCase = new ResetPasswordUseCase(repo, tokenStore, hasher);

    await useCase.execute({
      token,
      newPassword: 'novaSenha123',
    });

    const updated = await repo.findById(user.id);
    expect(updated?.password).toBe('hashed-novaSenha123');
  });

  it('should throw if token is invalid', async () => {
    const repo = new InMemoryUserRepository();
    const tokenStore = makeTokenStore();
    const hasher = makeHasher();

    const useCase = new ResetPasswordUseCase(repo, tokenStore, hasher);

    await expect(() =>
      useCase.execute({
        token: 'invalid-token',
        newPassword: 'senha',
      }),
    ).rejects.toThrow(InvalidOrExpiredTokenError);
  });

  it('should throw if user not found', async () => {
    const repo = new InMemoryUserRepository();
    const tokenMap = new Map<string, string>();
    const tokenStore = makeTokenStore(tokenMap);
    const hasher = makeHasher();

    tokenMap.set('valid-token', 'nonexistent-user');

    const useCase = new ResetPasswordUseCase(repo, tokenStore, hasher);

    await expect(() =>
      useCase.execute({
        token: 'valid-token',
        newPassword: 'senha',
      }),
    ).rejects.toThrow(UserNotFoundError);
  });
});
