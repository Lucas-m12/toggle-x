import { InMemoryUserRepository } from '@/infra/db/repositories/in-memory/in-memory-user-repository';
import { describe, it, expect, vi } from 'vitest';
import { LoginUserUseCase } from './login-user-use-case';
import { UserFactory } from '@/domain/user/factories/user-factory';
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials';
import { ExternalAuthNotAllowedError } from '@/domain/user/errors/external-auth-not-allowed';
import { UserBlockedError } from '@/domain/user/errors/user-blocked';
import { EmailNotVerifiedError } from '@/domain/user/errors/email-not-verified';


const makeAuthServiceMock = () => ({
  comparePassword: vi.fn().mockResolvedValue(true),
  generateJwt: vi.fn().mockReturnValue('token.jwt'),
  hashPassword: vi.fn(), // não usado aqui
});

const defaultUserData = {
  tenantId: 'tenant-1',
  name: 'Lucas',
  email: 'lucas@example.com',
  password: 'hashed',
};

describe('LoginUserUseCase', () => {
  it('should login with correct credentials', async () => {
    const repo = new InMemoryUserRepository();
    const auth = makeAuthServiceMock();
    const useCase = new LoginUserUseCase(repo, auth);

    const user = UserFactory.createInternalUser({ ...defaultUserData, password: 'hashed' });
    Object.assign(user, { emailVerified: true, status: 'active' });
    await repo.create(user);

    const result = await useCase.execute({
      tenantId: defaultUserData.tenantId,
      email: defaultUserData.email,
      password: '123456',
    });

    expect(result.accessToken).toBe('token.jwt');
    expect(auth.comparePassword).toHaveBeenCalled();
    expect(auth.generateJwt).toHaveBeenCalled();
  });

  it('should fail if user does not exist', async () => {
    const repo = new InMemoryUserRepository();
    const auth = makeAuthServiceMock();
    const useCase = new LoginUserUseCase(repo, auth);

    await expect(() =>
      useCase.execute({
        tenantId: 'x',
        email: 'none@example.com',
        password: '123456',
      }),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('should fail if user is external', async () => {
    const repo = new InMemoryUserRepository();
    const auth = makeAuthServiceMock();
    const useCase = new LoginUserUseCase(repo, auth);

    const user = UserFactory.createInternalUser({ ...defaultUserData, password: 'hashed' });
    Object.assign(user, {
      authType: 'external',
      providerId: 'auth0|123',
      status: 'active',
    });
    await repo.create(user);

    await expect(() =>
      useCase.execute({
        tenantId: defaultUserData.tenantId,
        email: defaultUserData.email,
        password: 'any',
      }),
    ).rejects.toThrow(ExternalAuthNotAllowedError);
  });

  it('should fail if user is not verified', async () => {
    const repo = new InMemoryUserRepository();
    const auth = makeAuthServiceMock();
    const useCase = new LoginUserUseCase(repo, auth);

    const user = UserFactory.createInternalUser({ ...defaultUserData, password: 'hashed' });
    Object.assign(user, { status: 'active', emailVerified: false });
    await repo.create(user);

    await expect(() =>
      useCase.execute({
        tenantId: defaultUserData.tenantId,
        email: defaultUserData.email,
        password: '123456',
      }),
    ).rejects.toThrow(EmailNotVerifiedError);
  });

  it('should fail if user is blocked', async () => {
    const repo = new InMemoryUserRepository();
    const auth = makeAuthServiceMock();
    const useCase = new LoginUserUseCase(repo, auth);

    const user = UserFactory.createInternalUser({ ...defaultUserData, password: 'hashed' });
    Object.assign(user, { status: 'blocked', emailVerified: true });
    await repo.create(user);

    await expect(() =>
      useCase.execute({
        tenantId: defaultUserData.tenantId,
        email: defaultUserData.email,
        password: '123456',
      }),
    ).rejects.toThrow(UserBlockedError);
  });
});
