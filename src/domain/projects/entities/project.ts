export class Project {
  readonly id: string;
  readonly tenantId: string;
  readonly createdAt: Date;
  readonly clientKey: string;
  updatedAt: Date;
  name: string;

  constructor(public readonly props: ProjectProps) {
    this.#validate(props);
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.clientKey = props.clientKey;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.name = props.name;
  }
  
  rename(newName: string) {
    if (!newName) {
      throw new Error('New name is required');
    }
    this.name = newName;
    this.updatedAt = new Date();
  }

  #validate(props: ProjectProps) {
    if (!props.tenantId) {
      throw new Error('Tenant ID is required');
    }
    if (!props.name) {
      throw new Error('Name is required');
    }
    if (!props.clientKey) {
      throw new Error('Client Key is required');
    }
    if (!props.id) {
      throw new Error('Id is required');
    }
    if (props.createdAt > props.updatedAt) {
      throw new Error('CreatedAt cannot be greater than UpdatedAt');
    }
    if (props.updatedAt < props.createdAt) {
      throw new Error('UpdatedAt cannot be less than CreatedAt');
    }
  }
}

export interface ProjectProps {
  id: string;
  tenantId: string;
  name: string;
  clientKey: string;
  createdAt: Date;
  updatedAt: Date;
}