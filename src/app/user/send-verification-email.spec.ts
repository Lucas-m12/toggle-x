import { UserNotFoundError } from '@/domain/user/errors/user-not-found';
import { UserFactory } from '@/domain/user/factories/user-factory';
import { InMemoryUserRepository } from '@/infra/db/repositories/in-memory/in-memory-user-repository';
import { describe, expect, it, vi } from 'vitest';
import { SendVerificationEmailUseCase } from './send-verification-email';

const makeTokenStore = () => ({
  generate: vi.fn().mockResolvedValue('token-123'),
  validate: vi.fn(),
});

const makeEmailSender = () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
});

describe('SendVerificationEmailUseCase', () => {
  const baseUrl = 'https://togglex.app';
  const userData = {
    tenantId: 'tenant-1',
    name: 'Lucas',
    email: 'lucas@example.com',
    password: 'hashed',
  };

  it('should send verification email to existing user', async () => {
    const repo = new InMemoryUserRepository();
    const user = UserFactory.createInternalUser(userData);
    await repo.create(user);

    const tokenStore = makeTokenStore();
    const emailSender = makeEmailSender();

    const useCase = new SendVerificationEmailUseCase(
      repo,
      emailSender,
      tokenStore,
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
      subject: 'Confirme seu e-mail',
      html: expect.stringContaining('/auth/verify-email?token=token-123'),
    });
  });

  it('should throw if user not found', async () => {
    const repo = new InMemoryUserRepository();
    const tokenStore = makeTokenStore();
    const emailSender = makeEmailSender();

    const useCase = new SendVerificationEmailUseCase(
      repo,
      emailSender,
      tokenStore,
    );

    await expect(() =>
      useCase.execute({
        tenantId: 'invalid',
        email: 'none@example.com',
        baseUrl,
      }),
    ).rejects.toThrow(UserNotFoundError);
  });
});
