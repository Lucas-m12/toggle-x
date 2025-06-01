import { User } from "@/domain/user/entities/user";

export class UserMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(row: any): User {
    return new User({
      id: row.id,
      tenantId: row.tenantId,
      name: row.name,
      email: row.email,
      authType: row.authType,
      password: row.password ?? undefined,
      providerId: row.providerId ?? undefined,
      emailVerified: row.emailVerified,
      status: row.status,
      role: row.role,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(user: User) {
    return {
      id: user.id,
      tenantId: user.tenantId,
      name: user.name,
      email: user.email,
      authType: user.authType,
      password: user.password,
      providerId: user.providerId,
      emailVerified: user.emailVerified,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
