import { describe, it, expect } from 'vitest';
import { User } from './user';
import { UserBlockedError } from '../errors/user-blocked';
import { UserNotApprovedError } from '../errors/user-not-approved';
import { EmailNotVerifiedError } from '../errors/email-not-verified';

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

  describe('User - Login Rules', () => {
    const base = {
      id: 'user-1',
      tenantId: 'tenant-1',
      name: 'Lucas',
      email: 'lucas@example.com',
      role: 'viewer' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should throw if user is blocked', () => {
      const user = new User({
        ...base,
        authType: 'internal',
        password: 'hash',
        status: 'blocked',
        emailVerified: true,
      });

      expect(() => user.assertCanLogin()).toThrow(UserBlockedError);
    });

    it('should throw if user is pending approval', () => {
      const user = new User({
        ...base,
        authType: 'internal',
        password: 'hash',
        status: 'pending',
        emailVerified: true,
      });

      expect(() => user.assertCanLogin()).toThrow(UserNotApprovedError);
    });

    it('should throw if internal user is not verified', () => {
      const user = new User({
        ...base,
        authType: 'internal',
        password: 'hash',
        status: 'active',
        emailVerified: false,
      });

      expect(() => user.assertCanLogin()).toThrow(EmailNotVerifiedError);
    });

    it('should allow login if internal user is active and verified', () => {
      const user = new User({
        ...base,
        authType: 'internal',
        password: 'hash',
        status: 'active',
        emailVerified: true,
      });

      expect(() => user.assertCanLogin()).not.toThrow();
    });

    it('should allow login for external user even if email not verified', () => {
      const user = new User({
        ...base,
        authType: 'external',
        providerId: 'auth0|abc123',
        status: 'active',
        emailVerified: false,
      });

      expect(() => user.assertCanLogin()).not.toThrow();
    });
  });
});
