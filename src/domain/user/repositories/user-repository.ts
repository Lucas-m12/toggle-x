import { User } from '../entities/user';

export interface UserRepository {
  findByEmail(tenantId: string, email: string): Promise<User | null>;
  findByProviderId(tenantId: string, providerId: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
  create(user: User): Promise<void>;
}
