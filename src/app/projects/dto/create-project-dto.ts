
export interface CreateProjectInput {
  tenantId: string;
  name: string;
}

export interface CreateProjectOutput {
  project: {
    id: string;
    name: string;
    clientKey: string;
    tenantId: string;
  };
}
