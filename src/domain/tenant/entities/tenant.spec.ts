import { describe, it, expect } from 'vitest';
import { Tenant } from './tenant';

describe('Tenant Entity', () => {
  it('should create tenant with internal auth', () => {
    const tenant = new Tenant({
      id: '1',
      name: 'Internal Inc.',
      authProvider: 'internal',
    });

    expect(tenant.isSso()).toBe(false);
    expect(tenant.canRegisterUsers()).toBe(true);
  });

  it('should create tenant with external auth', () => {
    const tenant = new Tenant({
      id: '2',
      name: 'External Corp.',
      authProvider: 'external',
    });

    expect(tenant.isSso()).toBe(true);
    expect(tenant.canRegisterUsers()).toBe(false);
  });

  it('should return default plan and max users', () => {
    const tenant = new Tenant({
      id: '3',
      name: 'Default Plan Co.',
      authProvider: 'internal',
    });

    expect(tenant.getPlan()).toBe('free');
    expect(tenant.getMaxUsers()).toBe(5);
  });

  it('should respect plan limits from authMetadata', () => {
    const tenant = new Tenant({
      id: '4',
      name: 'Pro Co.',
      authProvider: 'internal',
      authMetadata: { plan: 'pro' },
    });

    expect(tenant.getPlan()).toBe('pro');
    expect(tenant.getMaxUsers()).toBe(20);
  });

  it('should throw on missing id', () => {
    expect(() => {
      new Tenant({
        // @ts-expect-error: missing id
        name: 'Invalid',
        authProvider: 'internal',
      });
    }).toThrow('Tenant must have an id');
  });

  it('should throw on missing name', () => {
    expect(() => {
      new Tenant({
        // @ts-expect-error: missing name
        id: '5',
        authProvider: 'internal',
      });
    }).toThrow('Tenant must have a name');
  });

  it('should throw on invalid auth provider', () => {
    expect(() => {
      new Tenant({
        id: '6',
        name: 'Invalid Provider',
        // @ts-expect-error: invalid provider
        authProvider: 'google',
      });
    }).toThrow('Invalid authProvider for Tenant');
  });
});
