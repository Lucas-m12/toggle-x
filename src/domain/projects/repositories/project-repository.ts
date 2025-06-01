import { Project } from "../entities/project";

export interface ProjectRepository {
  create(project: Project): Promise<void>;
  findByTenantIdAndName(tenantId: string, name: string): Promise<Project | null>;
  findManyByTenantId(tenantId: string): Promise<Project[]>;
  findByClientKey(clientKey: string): Promise<Project | null>;
  existsWithName(tenantId: string, name: string): Promise<boolean>;
}
