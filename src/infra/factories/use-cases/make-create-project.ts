/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateProjectUseCase } from "@/app/projects/create-project-use-case";
import { db } from "@/infra/db/client";
import { DrizzleProjectRepository } from "@/infra/db/repositories/drizzle-project-repository";

export function makeCreateProjectUseCase() {
  const projectRepository = new DrizzleProjectRepository(db);
  return new CreateProjectUseCase(projectRepository);
}

export function makeCreateProjectUseCaseWithAnotherDb(anotherDb: any) {
  const projectRepository = new DrizzleProjectRepository(anotherDb);
  return new CreateProjectUseCase(projectRepository);
}
