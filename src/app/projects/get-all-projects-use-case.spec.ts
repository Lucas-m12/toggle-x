import { describe, it, expect, beforeEach } from 'vitest';
import { GetAllProjectsUseCase } from './get-all-projects-use-case';
import { InMemoryProjectRepository } from '@/infra/db/repositories/in-memory/in-memory-project-repository';
import { ProjectFactory } from '@/domain/projects/factories/project-factory';

describe('GetAllProjectsUseCase', () => {
  let projectRepository: InMemoryProjectRepository;
  let sut: GetAllProjectsUseCase;

  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository();
    sut = new GetAllProjectsUseCase(projectRepository);
  });

  it('should return all non-deleted projects for a tenant', async () => {
    const tenantId = 'tenant-123';

    const projectA = ProjectFactory.create(tenantId, 'A');
    const projectB = ProjectFactory.create(tenantId, 'B');
    const projectOtherTenant = ProjectFactory.create('other', 'C');

    await projectRepository.create(projectA);
    await projectRepository.create(projectB);
    await projectRepository.create(projectOtherTenant);

    const result = await sut.execute({ tenantId });

    expect(result.projects).toHaveLength(2);
    expect(result.projects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'A' }),
        expect.objectContaining({ name: 'B' }),
      ]),
    );
  });
});
