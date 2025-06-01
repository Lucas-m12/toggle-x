import { makeVerifyEmailUseCase } from '@/infra/factories/use-cases/user/make-verify-email';
import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyEmailSchema } from '../../schemas/user/verify-email';

export async function verifyEmailController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const parsed = verifyEmailSchema.safeParse(req.query);
  if (!parsed.success) {
    return reply.status(400).send({ message: 'Invalid token', error: parsed.error.format() });
  }
  const { token } = parsed.data;
  const useCase = makeVerifyEmailUseCase();
  await useCase.execute({ token });
  return reply.status(204).send();
}
