import { UserAlreadyExistsError } from '@/domain/user/errors/user-already-exist';
import { InMemoryUserRepository } from '@/infra/db/repositories/in-memory/in-memory-user-repository';
import { describe, expect, it, vi } from 'vitest';
import { AuthService } from '../auth/auth-service';
import { RegisterUserUseCase } from './register-user-use-case';

const makeAuthServiceMock = (): AuthService => ({
  hashPassword: vi.fn().mockResolvedValue('hashed-password'),
  comparePassword: vi.fn(),
  generateJwt: vi.fn(),
});

const makeEventBus = () => ({
  publish: vi.fn().mockResolvedValue(undefined),
  subscribe: vi.fn(),
});

const makeUseCase = () => {
  const userRepository = new InMemoryUserRepository();
  const authService = makeAuthServiceMock();
  const eventBus = makeEventBus();
  const useCase = new RegisterUserUseCase(userRepository, authService, eventBus);
  return { useCase, userRepository, authService, eventBus };
};

describe('RegisterUserUseCase', () => {
  it('should register a new internal user with hashed password', async () => {
    const { useCase, userRepository, authService } = makeUseCase();

    await useCase.execute({
      tenantId: 'tenant-1',
      name: 'Lucas',
      email: 'lucas@example.com',
      password: '123456',
    });

    const users = userRepository.getAll();
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('lucas@example.com');
    expect(users[0].password).toBe('hashed-password');
    expect(authService.hashPassword).toHaveBeenCalledWith('123456');
  });

  it('should not allow duplicate email for same tenant', async () => {
    const { useCase } = makeUseCase();

    await useCase.execute({
      tenantId: 'tenant-1',
      name: 'Lucas',
      email: 'lucas@example.com',
      password: '123456',
    });

    await expect(() =>
      useCase.execute({
        tenantId: 'tenant-1',
        name: 'Lucas',
        email: 'lucas@example.com',
        password: '123456',
      }),
    ).rejects.toThrow(UserAlreadyExistsError);
  });

  it('should allow same email for different tenants', async () => {
    const { useCase, userRepository } = makeUseCase();

    await useCase.execute({
      tenantId: 'tenant-1',
      name: 'Lucas',
      email: 'lucas@example.com',
      password: '123456',
    });

    await useCase.execute({
      tenantId: 'tenant-2',
      name: 'Lucas',
      email: 'lucas@example.com',
      password: '123456',
    });

    const users = userRepository.getAll();
    expect(users).toHaveLength(2);
  });

  it('should register a new user and publish event', async () => {
    const userData = {
      tenantId: 'tenant-1',
      name: 'Lucas',
      email: 'lucas@example.com',
      password: '123456',
    };
    const { useCase, eventBus } = makeUseCase();
    await useCase.execute(userData);
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        email: userData.email,
        tenantId: userData.tenantId,
      }),
    );
  });
});
