import { UserRepository } from '@/domain/user/repositories/user-repository';
import { AuthService } from '@/app/auth/auth-service';
import { UserAlreadyExistsError } from '@/domain/user/errors/user-already-exist';
import { UserFactory } from '@/domain/user/factories/user-factory';
import { RegisterUserInput } from './dto/register-user-dto';

export class RegisterUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly auth: AuthService,
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
    // TO-DO: enviar e-mail de verificação
  }
}
