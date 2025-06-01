export class UserRegisteredEvent {
  public readonly userId: string;
  public readonly email: string;
  public readonly tenantId: string;

  constructor(payload: UserRegisteredEventPayload) {
    this.userId = payload.userId;
    this.email = payload.email;
    this.tenantId = payload.tenantId;
  }
}

interface UserRegisteredEventPayload {
  userId: string;
  email: string;
  tenantId: string;
}
