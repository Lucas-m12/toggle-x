import { TenantIdIsRequired } from "@/domain/projects/errors/tenant-id-is-required";
import { ProjectRepository } from "@/domain/projects/repositories/project-repository";
import { GetAllProjectsUseCaseInput, GetAllProjectsUseCaseOutput } from "./dto/get-all-projects-dto";

export class GetAllProjectsUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: GetAllProjectsUseCaseInput): Promise<GetAllProjectsUseCaseOutput> {
    const { tenantId } = input;
    if (!tenantId) {
      throw new TenantIdIsRequired();
    }
    const projects = await this.projectRepository.findManyByTenantId(tenantId);
    return {
      projects: projects.map((project) => ({
        id: project.id,
        name: project.name,
        clientKey: project.clientKey,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      })),
    };
  }
}
