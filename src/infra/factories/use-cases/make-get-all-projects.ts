import { GetAllProjectsUseCase } from "@/app/projects/get-all-projects-use-case";
import { db } from "@/infra/db/client";
import { DrizzleProjectRepository } from "@/infra/db/repositories/drizzle-project-repository";

export const makeGetAllProjectsUseCase = () => {
  const projectRepository = new DrizzleProjectRepository(db);
  return new GetAllProjectsUseCase(projectRepository);
}
