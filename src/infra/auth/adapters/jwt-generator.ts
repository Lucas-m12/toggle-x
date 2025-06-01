import { TokenGenerator } from '@/app/ports/token-generator';
import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export class JwtTokenGenerator implements TokenGenerator {
  sign(
    payload: Record<string, unknown>,
    options?: SignOptions,
  ): string {
    return jwt.sign(payload, JWT_SECRET, options ?? { expiresIn: '2h' });
  }
}
