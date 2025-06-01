/* eslint-disable @typescript-eslint/no-explicit-any */
export type AuthProvider = 'internal' | 'external';

interface TenantProps {
  id: string;
  name: string;
  authProvider: AuthProvider;
  authMetadata?: Record<string, any>;
}

export class Tenant {
  public readonly id: string;
  public readonly name: string;
  public readonly authProvider: AuthProvider;
  public readonly authMetadata: Record<string, any>;

  constructor(props: TenantProps) {
    this.id = props.id;
    this.name = props.name;
    this.authProvider = props.authProvider;
    this.authMetadata = props.authMetadata ?? {};
    this.#validate();
  }

  isSso(): boolean {
    return this.authProvider === 'external';
  }

  canRegisterUsers(): boolean {
    return this.authProvider === 'internal';
  }

  getPlan(): 'free' | 'pro' | 'enterprise' {
    return this.authMetadata?.plan ?? 'free';
  }

  getMaxUsers(): number {
    switch (this.getPlan()) {
      case 'enterprise':
        return 100;
      case 'pro':
        return 20;
      case 'free':
      default:
        return 5;
    }
  }

  #validate() {
    if (!this.id) throw new Error('Tenant must have an id');
    if (!this.name) throw new Error('Tenant must have a name');
    if (!['internal', 'external'].includes(this.authProvider)) {
      throw new Error('Invalid authProvider for Tenant');
    }
  }
}
