import { EmailAlreadyVerifiedError } from "../errors/email-already-verified";
import { EmailNotVerifiedError } from "../errors/email-not-verified";
import { UserBlockedError } from "../errors/user-blocked";
import { UserNotApprovedError } from "../errors/user-not-approved";

export type UserStatus = 'pending' | 'active' | 'blocked';
export type UserRole = 'admin' | 'moderator' | 'editor' | 'viewer';
export type AuthType = 'internal' | 'external';

interface UserProps {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  authType: AuthType;
  password?: string;
  providerId?: string;
  emailVerified?: boolean;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  public readonly id: string;
  public readonly tenantId: string;
  public readonly name: string;
  public readonly email: string;
  public readonly authType: AuthType;
  public readonly password?: string;
  public readonly providerId?: string;
  public emailVerified: boolean;
  public readonly status: UserStatus;
  public readonly role: UserRole;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.name = props.name;
    this.email = props.email;
    this.authType = props.authType;
    this.password = props.password;
    this.providerId = props.providerId;
    this.emailVerified = props.emailVerified ?? false;
    this.status = props.status;
    this.role = props.role;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    this.validate();
  }

  private validate(): void {
    if (!this.id) throw new Error('User must have an id');
    if (!this.tenantId) throw new Error('User must have a tenantId');
    if (!this.email) throw new Error('User must have an email');
    if (!this.name) throw new Error('User must have a name');

    if (this.authType === 'internal') {
      if (!this.password) throw new Error('Internal user must have a password');
    }

    if (this.authType === 'external') {
      if (!this.providerId)
        throw new Error('External user must have a providerId');
    }
  }

  isActive(): boolean {
    return this.status === 'active' && this.emailVerified;
  }

  canLogin(): boolean {
    if (this.status !== 'active') return false;
    if (this.authType === 'internal') {
      return this.emailVerified === true;
    }
    return true;
  }

  assertCanLogin(): void {
    if (this.status === 'pending') {
      throw new UserNotApprovedError();
    }
    if (this.status === 'blocked') {
      throw new UserBlockedError();
    }
    if (this.authType === 'internal' && !this.emailVerified) {
      throw new EmailNotVerifiedError();
    }
  }

  markEmailAsVerified(): void {
    if (this.emailVerified) throw new EmailAlreadyVerifiedError(); // já verificado, não precisa atualizar
    this.emailVerified = true;
    this.updatedAt = new Date();
  }
}
