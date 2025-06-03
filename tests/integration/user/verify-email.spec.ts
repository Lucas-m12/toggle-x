/* eslint-disable @typescript-eslint/no-explicit-any */
import { VerifyEmailUseCase } from '@/app/user/verify-email-use-case';
import { InvalidOrExpiredTokenError } from '@/domain/user/errors/InvalidOrExpiredToken';
import { UserNotFoundError } from '@/domain/user/errors/user-not-found';
import { UserFactory } from '@/domain/user/factories/user-factory';
import { RedisEmailVerificationTokenStore } from '@/infra/auth/adapters/redis-email-verification-token-store';
import { DrizzleUserRepository } from '@/infra/db/repositories/drizzle-user-repository';
import * as schema from '@/infra/db/schemas';
import { drizzle } from 'drizzle-orm/node-postgres';
import Redis from 'ioredis';
import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

describe('Integration: VerifyEmailUseCase with Redis', () => {
  let container: StartedTestContainer;
  let pgContainer: StartedTestContainer;
  let redisClient: Redis;
  let db: any;
  let client: Client;

  beforeAll(async () => {
    container = await new GenericContainer('redis')
      .withExposedPorts(6379)
      .start();

    const port = container.getMappedPort(6379);
    const host = container.getHost();
    redisClient = new Redis({ host, port });

    pgContainer = await new GenericContainer('postgres')
      .withEnvironment({
        POSTGRES_USER: 'postgres',
        POSTGRES_PASSWORD: 'test',
        POSTGRES_DB: 'testdb',
      })
      .withExposedPorts(5432)
      .start();

    const pgHost = pgContainer.getHost();
    const pgPort = pgContainer.getMappedPort(5432);
    const connectionString = `postgres://postgres:test@${pgHost}:${pgPort}/testdb`;
    client = new Client({ connectionString });

    await client.connect();

    const migrationDir = path.resolve(__dirname, '../../../drizzle/migrations');
    const sqlFiles = fs
      .readdirSync(migrationDir)
      .filter((file) => file.endsWith('.sql'));

    for (const file of sqlFiles) {
      const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
      await client.query(sql);
    }
    db = drizzle(client, { schema: { users: schema.users } });
  });

  afterAll(async () => {
    await client.end();
    await redisClient.quit();
    await container.stop();
  });

  afterEach(async () => {
    await Promise.all([
      db.delete(schema.users),
      redisClient.flushall(),
    ]);
  });

  it('should verify email for a valid token', async () => {
    const userRepository = new DrizzleUserRepository(db);
    const tokenStore = new RedisEmailVerificationTokenStore(redisClient);
    const user = UserFactory.createInternalUser({
      tenantId: 'tenant-1',
      name: 'Lucas',
      email: 'lucas@example.com',
      password: 'hashed-password',
    });
    await userRepository.create(user);
    const token = await tokenStore.generate(user.id);
    const useCase = new VerifyEmailUseCase(userRepository, tokenStore);
    await useCase.execute({ token });
    const updated = await userRepository.findById(user.id);
    expect(updated?.emailVerified).toBe(true);
  });

  it('should throw error for invalid token', async () => {
    const userRepository = new DrizzleUserRepository(db);
    const tokenStore = new RedisEmailVerificationTokenStore(redisClient);
    const useCase = new VerifyEmailUseCase(userRepository, tokenStore);

    await expect(() =>
      useCase.execute({ token: 'invalid-token' }),
    ).rejects.toThrow(InvalidOrExpiredTokenError);
  });

  it('should throw if user does not exist', async () => {
    const userRepository = new DrizzleUserRepository(db);
    const tokenStore = new RedisEmailVerificationTokenStore(redisClient);
    await redisClient.set('email-verification:valid-token', 'nonexistent-user');
    const useCase = new VerifyEmailUseCase(userRepository, tokenStore);
    await expect(() =>
      useCase.execute({ token: 'valid-token' }),
    ).rejects.toThrow(UserNotFoundError);
  });
});
