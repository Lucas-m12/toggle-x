/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, beforeAll, afterAll, it, expect, afterEach } from 'vitest';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from '@/infra/db/schemas';
import fs from 'node:fs';
import path from 'node:path';

import { BcryptHasher } from '@/infra/auth/adapters/bcrypt-hasher';
import { JwtTokenGenerator } from '@/infra/auth/adapters/jwt-generator';
import { DrizzleUserRepository } from '@/infra/db/repositories/drizzle-user-repository';
import { InternalAuthService } from '@/infra/auth/internal-auth-service';
import { RegisterUserUseCase } from '@/app/user/register-user-use-case';
import { UserAlreadyExistsError } from '@/domain/user/errors/user-already-exist';

let container: StartedTestContainer;
let client: Client;
let db: any;

describe('RegisterUserUseCase - Integration', () => {
  beforeAll(async () => {
    container = await new GenericContainer('postgres')
      .withEnvironment({
        POSTGRES_USER: 'postgres',
        POSTGRES_PASSWORD: 'test',
        POSTGRES_DB: 'testdb',
      })
      .withExposedPorts(5432)
      .start();

    const host = container.getHost();
    const port = container.getMappedPort(5432);
    const connectionString = `postgres://postgres:test@${host}:${port}/testdb`;
    client = new Client({ connectionString });

    await client.connect();

    const migrationDir = path.resolve(
      __dirname,
      "../../../drizzle/migrations"
    );
    const sqlFiles = fs
      .readdirSync(migrationDir)
      .filter((file) => file.endsWith(".sql"));

    for (const file of sqlFiles) {
      const sql = fs.readFileSync(path.join(migrationDir, file), "utf8");
      await client.query(sql);
    }
    db = drizzle(client, { schema: { users: schema.users } });
  });

  afterAll(async () => {
    await client.end();
    await container.stop();
  });

  afterEach(async () => {
    await db.delete(schema.users);
  });

  it('should register a user with hashed password in the real DB', async () => {
    const repo = new DrizzleUserRepository(db);
    const auth = new InternalAuthService(
      new BcryptHasher(),
      new JwtTokenGenerator(),
    );
    const useCase = new RegisterUserUseCase(repo, auth);

    await useCase.execute({
      tenantId: 'tenant-1',
      name: 'Lucas',
      email: 'lucas@example.com',
      password: '123456',
    });

    const saved = await repo.findByEmail('tenant-1', 'lucas@example.com');
    expect(saved).not.toBeNull();
    expect(saved?.email).toBe('lucas@example.com');
    expect(saved?.password).not.toBe('123456'); // hash
  });

  it('should not allow duplicate emails for the same tenant', async () => {
    const repo = new DrizzleUserRepository(db);
    const auth = new InternalAuthService(
      new BcryptHasher(),
      new JwtTokenGenerator(),
    );
    const useCase = new RegisterUserUseCase(repo, auth);

    await useCase.execute({
      tenantId: 'tenant-1',
      name: 'Lucas',
      email: 'lucas@example.com',
      password: '123456',
    });

    await expect(() =>
      useCase.execute({
        tenantId: 'tenant-1',
        name: 'Lucas',
        email: 'lucas@example.com',
        password: '123456',
      }),
    ).rejects.toThrow(UserAlreadyExistsError);
  });
});
