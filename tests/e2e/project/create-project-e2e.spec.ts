import { projects } from "@/infra/db/schemas/project";
import { makeCreateProjectUseCaseWithAnotherDb } from "@/infra/factories/use-cases/make-create-project";
import { app } from "@/infra/http/fastify";
import { drizzle } from "drizzle-orm/node-postgres";
import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";
import request from "supertest";
import { GenericContainer } from "testcontainers";
import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";


describe("Create Project E2E", () => {
  let client: Client;

  beforeEach(async () => {
    const container = await new GenericContainer("postgres")
      .withEnvironment({
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "test",
        POSTGRES_DB: "testdb",
      })
      .withExposedPorts(5432)
      .start();

    const host = container.getHost();
    const port = container.getMappedPort(5432);
    const connectionString = `postgres://postgres:test@${host}:${port}/testdb`;

    client = new Client({ connectionString });
    await client.connect();

    const migrationDir = path.resolve(__dirname, "../../../drizzle/migrations");
    const sqlFiles = fs
      .readdirSync(migrationDir)
      .filter((file) => file.endsWith(".sql"));

    for (const file of sqlFiles) {
      const sql = fs.readFileSync(path.join(migrationDir, file), "utf8");
      await client.query(sql);
    }
    console.log("Test database connected and migrations applied");
  });

  afterAll(async () => {
    await client.end();
  });

  // beforeEach(async () => {
  //   await client.query(`TRUNCATE TABLE projects RESTART IDENTITY`);
  //   console.log("Test database truncated");
  // });

  test("should create a new project", async () => {
    const testDb = drizzle(client, { schema: { projects } });
    vi.mock("@/infra/factories/use-cases/make-create-project", () => {
      return {
        makeCreateProjectUseCase: () =>
          makeCreateProjectUseCaseWithAnotherDb(testDb),
      };
    });
    console.log("Starting test");
    console.log("Test database ready for use", app.server);
    const response = await request(app.server)
      .post("/admin/projects")
      .set("Content-Type", "application/json")
      .send({ name: "Project test" });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: "Project test",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
