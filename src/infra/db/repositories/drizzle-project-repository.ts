import { Project } from "@/domain/projects/entities/project";
import { ProjectRepository } from "@/domain/projects/repositories/project-repository";
import { and, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { ProjectMapper } from "../mappers/project-mapper";
import { projects } from "../schemas/project";

export class DrizzleProjectRepository implements ProjectRepository {
  constructor(private readonly db: PostgresJsDatabase<{ projects: typeof projects }>) { }

  async create(project: Project): Promise<void> {
    const data = ProjectMapper.toPersistence(project);
    await this.db.insert(projects).values(data);
  }

  async findManyByTenantId(tenantId: string): Promise<Project[]> {
    const rows = await this.db
      .select()
      .from(projects)
      .where(eq(projects.tenantId, tenantId));
    return rows.map((row) => ProjectMapper.toDomain(row));
  }

  async findByClientKey(clientKey: string): Promise<Project | null> {
    const row = await this.db.query.projects.findFirst({
      where: (fields, operators) => operators.eq(fields.clientKey, clientKey),
    });
    return row ? ProjectMapper.toDomain(row) : null;
  }

  async findByTenantIdAndName(tenantId: string, name: string): Promise<Project | null> {
    const row = await this.db.query.projects.findFirst({
      where: (fields, operators) => operators.and(
        operators.eq(fields.tenantId, tenantId),
        operators.eq(fields.name, name)
      ),
    });
    return row ? ProjectMapper.toDomain(row) : null;
  }

  async existsWithName(tenantId: string, name: string): Promise<boolean> {
    const [existing] = await this.db
      .select()
      .from(projects)
      .where(and(eq(projects.tenantId, tenantId), eq(projects.name, name)))
      .limit(1);
    return !!existing;
  }
}
