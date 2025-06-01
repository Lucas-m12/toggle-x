import { AuthService } from '@/app/auth/auth-service';
import { PasswordHasher } from '@/app/ports/password-hasher';
import { TokenGenerator } from '@/app/ports/token-generator';

export class InternalAuthService implements AuthService {
  constructor(
    private readonly hasher: PasswordHasher,
    private readonly tokenGen: TokenGenerator,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return this.hasher.hash(password);
  }

  async comparePassword(raw: string, hash: string): Promise<boolean> {
    return this.hasher.compare(raw, hash);
  }

  generateJwt(payload: Record<string, unknown>): string {
    return this.tokenGen.sign(payload, { expiresIn: '2h' });
  }
}
