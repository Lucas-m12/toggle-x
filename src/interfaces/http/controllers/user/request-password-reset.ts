import { makeRequestPasswordResetUseCase } from '@/infra/factories/use-cases/user/make-request-password-reset';
import { FastifyReply, FastifyRequest } from 'fastify';
import { requestPasswordResetSchema } from '../../schemas/user/request-reset-password';

export async function requestPasswordResetController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const parsed = requestPasswordResetSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.format() });
  }
  const { tenantId, email, baseUrl } = parsed.data;
  const useCase = makeRequestPasswordResetUseCase();
  await useCase.execute({
    tenantId,
    email,
    baseUrl: baseUrl ?? process.env.APP_BASE_URL ?? 'https://app.togglex.com',
  });
  return reply.status(204).send();
}
