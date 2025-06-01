import { AuthService } from '@/app/auth/auth-service';
import { DomainEventBus } from '@/core/events/domain-event-bus';
import { UserAlreadyExistsError } from '@/domain/user/errors/user-already-exist';
import { UserRegisteredEvent } from '@/domain/user/events/user-registered';
import { UserFactory } from '@/domain/user/factories/user-factory';
import { UserRepository } from '@/domain/user/repositories/user-repository';
import { RegisterUserInput } from './dto/register-user-dto';

export class RegisterUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly auth: AuthService,
    private readonly eventBus: DomainEventBus,
  ) {}

  async execute(input: RegisterUserInput): Promise<void> {
    const existing = await this.users.findByEmail(input.tenantId, input.email);
    if (existing) {
      throw new UserAlreadyExistsError();
    }
    const passwordHash = await this.auth.hashPassword(input.password);
    const user = UserFactory.createInternalUser({
      tenantId: input.tenantId,
      name: input.name,
      email: input.email,
      password: passwordHash,
    })
    await this.users.create(user);
    this.eventBus.publish(new UserRegisteredEvent({
      userId: user.id,
      email: user.email,
      tenantId: user.tenantId,
    }));
  }
}
