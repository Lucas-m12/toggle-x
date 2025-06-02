import { User } from '@/domain/user/entities/user';
import { UserRepository } from '@/domain/user/repositories/user-repository';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findByEmail(tenantId: string, email: string): Promise<User | null> {
    return (
      this.users.find((u) => u.tenantId === tenantId && u.email === email) ??
      null
    );
  }

  async findByProviderId(
    tenantId: string,
    providerId: string,
  ): Promise<User | null> {
    return (
      this.users.find(
        (u) => u.tenantId === tenantId && u.providerId === providerId,
      ) ?? null
    );
  }

  async findById(userId: string): Promise<User | null> {
    return this.users.find((u) => u.id === userId) ?? null;
  }

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async verifyEmail(userId: string): Promise<void> {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.emailVerified = true;
      user.updatedAt = new Date();
    }
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.password = hashedPassword;
      user.updatedAt = new Date();
    }
  }

  // útil em testes
  getAll(): User[] {
    return this.users;
  }
}
