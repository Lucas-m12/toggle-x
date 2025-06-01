import type { AuthPayload, TokenVerifier } from '@/app/ports/token-verifier';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export class JwtTokenVerifier implements TokenVerifier {
  verify(token: string): AuthPayload {
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      tenantId: string;
      role: string;
    };

    return {
      userId: payload.sub,
      tenantId: payload.tenantId,
      role: payload.role as AuthPayload['role'],
    };
  }
}
