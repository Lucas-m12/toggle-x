import { GenerateId } from '@/core/id/generate-id';
import { User, type UserRole, type UserStatus } from '../entities/user';

interface CreateInternalUserInput {
  tenantId: string;
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
}

export class UserFactory {
  static createInternalUser(input: CreateInternalUserInput): User {
    return new User({
      id: GenerateId.generate(),
      tenantId: input.tenantId,
      name: input.name,
      email: input.email,
      authType: 'internal',
      password: input.password,
      providerId: undefined,
      emailVerified: false,
      status: input.status ?? 'pending',
      role: input.role ?? 'viewer',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
