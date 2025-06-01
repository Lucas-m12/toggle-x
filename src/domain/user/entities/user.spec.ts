import { describe, it, expect } from 'vitest';
import { User } from './user';

const commonProps = {
  id: 'user-1',
  tenantId: 'tenant-1',
  name: 'Lucas',
  email: 'lucas@example.com',
  status: 'active' as const,
  role: 'viewer' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('User Entity', () => {
  it('should create a valid internal user', () => {
    const user = new User({
      ...commonProps,
      authType: 'internal',
      password: 'hashed-password',
      emailVerified: true,
    });

    expect(user.isActive()).toBe(true);
  });

  it('should fail to create internal user without password', () => {
    expect(() => {
      new User({
        ...commonProps,
        authType: 'internal',
        emailVerified: true,
        // password omitted
      });
    }).toThrow('Internal user must have a password');
  });

  it('should create a valid external user', () => {
    const user = new User({
      ...commonProps,
      authType: 'external',
      providerId: 'auth0|user-123',
      emailVerified: true,
    });
    expect(user.isActive()).toBe(true);
  });

  it('should fail to create external user without providerId', () => {
    expect(() => {
      new User({
        ...commonProps,
        authType: 'external',
        // providerId omitted
      });
    }).toThrow('External user must have a providerId');
  });

  it('should consider internal user inactive if not verified', () => {
    const user = new User({
      ...commonProps,
      authType: 'internal',
      password: 'hashed',
      emailVerified: false,
    });

    expect(user.isActive()).toBe(false);
  });
});
