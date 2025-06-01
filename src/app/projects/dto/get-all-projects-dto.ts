export interface GetAllProjectsUseCaseInput {
  tenantId: string;
}

export interface GetAllProjectsUseCaseOutput {
  projects: {
    id: string;
    name: string;
    clientKey: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}
