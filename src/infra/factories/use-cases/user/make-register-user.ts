import { RegisterUserUseCase } from '@/app/user/register-user-use-case';
import { globalEventBus } from '@/core/events/global-event-bus';
import { BcryptHasher } from '@/infra/auth/adapters/bcrypt-hasher';
import { JwtTokenGenerator } from '@/infra/auth/adapters/jwt-generator';
import { InternalAuthService } from '@/infra/auth/internal-auth-service';
import { db } from '@/infra/db/client';
import { DrizzleUserRepository } from '@/infra/db/repositories/drizzle-user-repository';

export function makeRegisterUserUseCase(): RegisterUserUseCase {
  const userRepository = new DrizzleUserRepository(db);
  const hasher = new BcryptHasher();
  const jwt = new JwtTokenGenerator();

  const authService = new InternalAuthService(hasher, jwt);

  return new RegisterUserUseCase(userRepository, authService, globalEventBus);
}
