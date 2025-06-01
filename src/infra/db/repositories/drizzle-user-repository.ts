
import { User } from '@/domain/user/entities/user';
import { UserRepository } from '@/domain/user/repositories/user-repository';
import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { UserMapper } from '../mappers/user-mapper';
import { users } from '../schemas/user';

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly db: PostgresJsDatabase<{ users: typeof users }>) { }

  async findByEmail(tenantId: string, email: string): Promise<User | null> {
    const row = await this.db.query.users.findFirst({
      where: and(eq(users.tenantId, tenantId), eq(users.email, email)),
    });
    return row ? UserMapper.toDomain(row) : null;
  }

  async findByProviderId(
    tenantId: string,
    providerId: string,
  ): Promise<User | null> {
    const row = await this.db.query.users.findFirst({
      where: and(
        eq(users.tenantId, tenantId),
        eq(users.providerId, providerId),
      ),
    });

    return row ? UserMapper.toDomain(row) : null;
  }

  async findById(userId: string): Promise<User | null> {
    const row = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    return row ? UserMapper.toDomain(row) : null;
  }

  async create(user: User): Promise<void> {
    const input = UserMapper.toPersistence(user);
    await this.db.insert(users).values(input);
  }

  async verifyEmail(userId: string): Promise<void> {
    await this.db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, userId));
  }
}
