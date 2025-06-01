import { Project } from "@/domain/projects/entities/project";

export class ProjectMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(row: any): Project {
    return new Project({
      id: row.id,
      tenantId: row.tenantId,
      name: row.name,
      clientKey: row.clientKey,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(project: Project) {
    return {
      id: project.id,
      tenantId: project.tenantId,
      name: project.name,
      clientKey: project.clientKey,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
