import { PasswordHasher } from '@/app/ports/password-hasher';
import bcrypt from 'bcryptjs';

export class BcryptHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash);
  }
}
