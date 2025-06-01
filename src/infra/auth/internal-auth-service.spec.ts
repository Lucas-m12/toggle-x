import { describe, it, expect, vi } from 'vitest';
import { InternalAuthService } from '@/infra/auth/internal-auth-service';
import { PasswordHasher } from '@/app/ports/password-hasher';
import { TokenGenerator } from '@/app/ports/token-generator';

const createMocks = () => {
  const hasher: PasswordHasher = {
    hash: vi.fn().mockResolvedValue('hashed-password'),
    compare: vi.fn().mockResolvedValue(true),
  };

  const tokenGen: TokenGenerator = {
    sign: vi.fn().mockReturnValue('mocked.jwt.token'),
  };

  const service = new InternalAuthService(hasher, tokenGen);

  return { hasher, tokenGen, service };
};

describe('InternalAuthService', () => {
  it('should hash the password', async () => {
    const { service, hasher } = createMocks();
    const result = await service.hashPassword('123456');
    expect(result).toBe('hashed-password');
    expect(hasher.hash).toHaveBeenCalledWith('123456');
  });

  it('should compare passwords', async () => {
    const { service, hasher } = createMocks();
    const result = await service.comparePassword('plain', 'hashed');
    expect(result).toBe(true);
    expect(hasher.compare).toHaveBeenCalledWith('plain', 'hashed');
  });

  it('should generate JWT token', () => {
    const { service, tokenGen } = createMocks();
    const token = service.generateJwt({ userId: 'abc123' });
    expect(token).toBe('mocked.jwt.token');
    expect(tokenGen.sign).toHaveBeenCalledWith(
      { userId: 'abc123' },
      { expiresIn: '2h' },
    );
  });
});
