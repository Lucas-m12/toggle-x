import { LoginUserInput, LoginUserOutput } from './dto/login-user-use-case-dto';
import { UserRepository } from '@/domain/user/repositories/user-repository';
import { AuthService } from '../auth/auth-service';
import { ExternalAuthNotAllowedError } from '@/domain/user/errors/external-auth-not-allowed';
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials';

const TWO_HOURS_IN_SECONDS = 2 * 60 * 60;

export class LoginUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly auth: AuthService,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.users.findByEmail(input.tenantId, input.email);
    if (!user) throw new InvalidCredentialsError();
    if (user.authType !== 'internal') throw new ExternalAuthNotAllowedError();
    user.assertCanLogin();
    const isValidPassword = await this.auth.comparePassword(
      input.password,
      user.password!,
    );
    if (!isValidPassword) throw new InvalidCredentialsError();
    const accessToken = this.auth.generateJwt({
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    });
    return {
      accessToken,
      expiresIn: TWO_HOURS_IN_SECONDS,
    };
  }
}
