import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { UserRole, UserStatus, AuthType } from '@/domain/user/entities/user';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  authType: text('auth_type').$type<AuthType>().notNull(),
  password: text('password'), // opcional: só p/ internal
  providerId: text('provider_id'), // opcional: só p/ external
  emailVerified: boolean('email_verified').notNull().default(false),
  status: text('status').$type<UserStatus>().notNull(),
  role: text('role').$type<UserRole>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
