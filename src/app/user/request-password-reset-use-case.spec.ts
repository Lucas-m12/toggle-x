import { UserNotFoundError } from '@/domain/user/errors/user-not-found';
import { UserFactory } from '@/domain/user/factories/user-factory';
import { InMemoryUserRepository } from '@/infra/db/repositories/in-memory/in-memory-user-repository';
import { describe, expect, it, vi } from 'vitest';
import { RequestPasswordResetUseCase } from './request-password-use-case';

const makeTokenStore = () => ({
  generate: vi.fn().mockResolvedValue('reset-token-123'),
  validate: vi.fn(),
});

const makeEmailSender = () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
});

describe('RequestPasswordResetUseCase', () => {
  const baseUrl = 'https://togglex.app';
  const userData = {
    tenantId: 'tenant-1',
    name: 'Lucas',
    email: 'lucas@example.com',
    password: 'hashed',
  };

  it('should send reset password email if user exists', async () => {
    const repo = new InMemoryUserRepository();
    const user = UserFactory.createInternalUser(userData);
    await repo.create(user);

    const tokenStore = makeTokenStore();
    const emailSender = makeEmailSender();

    const useCase = new RequestPasswordResetUseCase(
      repo,
      tokenStore,
      emailSender,
    );

    await useCase.execute({
      tenantId: user.tenantId,
      email: user.email,
      baseUrl,
    });

    expect(tokenStore.generate).toHaveBeenCalledWith(user.id);
    expect(emailSender.sendEmail).toHaveBeenCalledWith({
      tenantId: user.tenantId,
      to: user.email,
      subject: 'Redefinição de senha',
      html: expect.stringContaining('reset-password?token=reset-token-123'),
    });
  });

  it('should throw if user not found', async () => {
    const repo = new InMemoryUserRepository();
    const tokenStore = makeTokenStore();
    const emailSender = makeEmailSender();

    const useCase = new RequestPasswordResetUseCase(
      repo,
      tokenStore,
      emailSender,
    );

    await expect(() =>
      useCase.execute({
        tenantId: 'nonexistent',
        email: 'none@example.com',
        baseUrl,
      }),
    ).rejects.toThrow(UserNotFoundError);
  });
});
