import { Project } from "@/domain/projects/entities/project";
import { ProjectRepository } from "@/domain/projects/repositories/project-repository";

export class InMemoryProjectRepository implements ProjectRepository {
  private projects: Project[] = [];

  async create(project: Project): Promise<void> {
    this.projects.push(project);
  }

  async findManyByTenantId(tenantId: string): Promise<Project[]> {
    return this.projects.filter((p) => p.tenantId === tenantId);
  }

  async findByClientKey(clientKey: string): Promise<Project | null> {
    return this.projects.find((p) => p.clientKey === clientKey) || null;
  }

  async existsWithName(tenantId: string, name: string): Promise<boolean> {
    return this.projects.some(
      (p) => p.tenantId === tenantId && p.name === name,
    );
  }

  async findByTenantIdAndName(
    tenantId: string,
    name: string,
  ): Promise<Project | null> {
    return (
      this.projects.find((p) => p.tenantId === tenantId && p.name === name) ||
      null
    );
  }
}
