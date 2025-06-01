import { GenerateId } from "../../../core/id/generate-id";
import { GenerateClientKey } from "../../../core/security/generate-client-key";
import { Project, ProjectProps } from "../entities/project";

export class ProjectFactory {
  static create(tenantId: string, name: string): Project {
    const props: ProjectProps = {
      id: GenerateId.generate(),
      tenantId,
      name,
      clientKey: GenerateClientKey.generate(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const project = new Project(props);
    return project;
  }
}
