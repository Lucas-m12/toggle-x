import { CreateProjectUseCase } from "@/app/projects/create-project-use-case";
import { DrizzleProjectRepository } from "@/infra/db/repositories/drizzle-project-repository";
import { projects } from "@/infra/db/schemas/project";
import { drizzle } from "drizzle-orm/node-postgres";
import fs from "fs";
import path from "path";
import { Client } from "pg";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { afterAll, beforeAll, describe, expect, it } from "vitest";


describe("integration tests to create project", () => {
  let client: Client;
  let container: StartedTestContainer;

  beforeAll(async () => {
    container = await new GenericContainer("postgres")
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
  });

  afterAll(async () => {
    await container.stop();
    await client.end();
  });

  it("create project and validate unique name rule by tenant", async () => {
    const db = drizzle(client, { schema: { projects } });
    const repo = new DrizzleProjectRepository(db);
    const useCase = new CreateProjectUseCase(repo);

    const result = await useCase.execute({
      tenantId: "tenant_a",
      name: "Project A",
    });

    expect(result.project.name).toBe("Project A");

    const resultB = await useCase.execute({
      tenantId: "tenant_b",
      name: "Project A",
    });

    expect(resultB.project.tenantId).toBe("tenant_b");

    await expect(() =>
      useCase.execute({ tenantId: "tenant_a", name: "Project A" })
    ).rejects.toThrow(`Project with name "Project A" already exists`);

    const projectsA = await repo.findByTenantIdAndName("tenant_a", "Project A");
    const projectsB = await repo.findByTenantIdAndName("tenant_b", "Project A");
    expect(projectsA).not.toBeNull();
    expect(projectsB).not.toBeNull();
    expect(projectsA?.tenantId).toBe("tenant_a");
    expect(projectsB?.tenantId).toBe("tenant_b");
    expect(projectsA?.name).toBe("Project A");
    expect(projectsB?.name).toBe("Project A");
    expect(projectsA?.clientKey).not.toBeNull();
    expect(projectsB?.clientKey).not.toBeNull();
    expect(projectsA?.clientKey).not.toBe(projectsB?.clientKey);
  });
});
