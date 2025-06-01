import { TokenVerifier } from '@/app/ports/token-verifier';
import { UserRole } from '@/domain/user/entities/user';
import { JwtTokenVerifier } from '@/infra/auth/adapters/jwt-verifier';
import { FastifyReply, FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    auth: {
      userId: string;
      tenantId: string;
      role: UserRole;
    };
  }
}

const verifier: TokenVerifier = new JwtTokenVerifier();

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send();
  }
  const token = authHeader.replace('Bearer ', '').trim();
  try {
    const payload = verifier.verify(token);
    req.auth = {
      userId: payload.userId,
      tenantId: payload.tenantId,
      role: payload.role,
    };
  } catch {
    return reply.status(401).send();
  }
}
