import { describe, it, expect, vi } from 'vitest';
import { AuthService } from '../auth/auth-service';
import { InMemoryUserRepository } from '@/infra/db/repositories/in-memory/in-memory-user-repository';
import { RegisterUserUseCase } from './register-user-use-case';
import { UserAlreadyExistsError } from '@/domain/user/errors/user-already-exist';

const makeAuthServiceMock = (): AuthService => ({
  hashPassword: vi.fn().mockResolvedValue('hashed-password'),
  comparePassword: vi.fn(),
  generateJwt: vi.fn(),
});

const makeUseCase = () => {
  const userRepository = new InMemoryUserRepository();
  const authService = makeAuthServiceMock();
  const useCase = new RegisterUserUseCase(userRepository, authService);
  return { useCase, userRepository, authService };
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
});
