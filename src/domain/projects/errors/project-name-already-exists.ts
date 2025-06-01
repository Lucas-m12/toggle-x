import { AppError } from "@/core/errors/app-error";

export class ProjectNameAlreadyExistsError extends AppError {
  constructor(projectName: string) {
    super(`Project with name "${projectName}" already exists.`);
    this.name = "ProjectNameAlreadyExistError";
  }
}
