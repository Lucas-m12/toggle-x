import { ProjectNameAlreadyExistsError } from "@/domain/projects/errors/project-name-already-exists";
import { ProjectFactory } from "@/domain/projects/factories/project-factory";
import { ProjectRepository } from "@/domain/projects/repositories/project-repository";
import { CreateProjectInput, CreateProjectOutput } from "./dto/create-project-dto";

export class CreateProjectUseCase {
  constructor(
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(input: CreateProjectInput): Promise<CreateProjectOutput> {
    const nameAlreadyExists = await this.projectRepository.existsWithName(
      input.tenantId, input.name
    );
    if (nameAlreadyExists) {
      throw new ProjectNameAlreadyExistsError(input.name);
    }
    const project = ProjectFactory.create(input.tenantId, input.name);
    await this.projectRepository.create(project);
    return {
      project: {
        id: project.id,
        name: project.name,
        clientKey: project.clientKey,
        tenantId: project.tenantId,
      },
    };
  }
}
