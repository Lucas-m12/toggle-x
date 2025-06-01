import { ProjectFactory } from "@/domain/projects/factories/project-factory";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateProjectUseCase } from "./create-project-use-case";
import { InMemoryProjectRepository } from "@/infra/db/repositories/in-memory/in-memory-project-repository";

describe("CreateProjectUseCase", () => {
  let projectRepository: InMemoryProjectRepository;
  let createProjectUseCase: CreateProjectUseCase;

  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository();
    createProjectUseCase = new CreateProjectUseCase(projectRepository);
  });

  it("create a new project with unique name", async () => {
    const output = await createProjectUseCase.execute({
      tenantId: "tenant-123",
      name: "New project",
    });

    expect(output.project).toMatchObject({
      name: "New project",
      clientKey: expect.stringMatching(/^togx_pk_/),
    });
  });

  it("throws an error if the project name already exists for the tenant", async () => {
    const existing = ProjectFactory.create("tenant-123", "Duplicated");
    await projectRepository.create(existing);

    await expect(() =>
      createProjectUseCase.execute({
        tenantId: "tenant-123",
        name: "Duplicated",
      })
    ).rejects.toThrow(`Project with name "Duplicated" already exists`);
  });
});
