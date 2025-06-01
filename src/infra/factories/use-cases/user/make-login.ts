import { LoginUserUseCase } from '@/app/user/login-user-use-case';
import { BcryptHasher } from '@/infra/auth/adapters/bcrypt-hasher';
import { JwtTokenGenerator } from '@/infra/auth/adapters/jwt-generator';
import { InternalAuthService } from '@/infra/auth/internal-auth-service';
import { db } from '@/infra/db/client';
import { DrizzleUserRepository } from '@/infra/db/repositories/drizzle-user-repository';

export function makeLoginUserUseCase(): LoginUserUseCase {
  const repo = new DrizzleUserRepository(db);
  const auth = new InternalAuthService(
    new BcryptHasher(),
    new JwtTokenGenerator(),
  );
  return new LoginUserUseCase(repo, auth);
}
