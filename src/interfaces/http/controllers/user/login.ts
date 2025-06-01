import { FastifyRequest, FastifyReply } from 'fastify';
import { loginSchema } from '../../schemas/user/login';
import { makeLoginUserUseCase } from '@/infra/factories/use-cases/user/make-login';

export async function loginController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const parsed = loginSchema.safeParse(req);
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.format() });
  }
  const { email, password, tenantId } = parsed.data.body;
  const useCase = makeLoginUserUseCase();
  const result = await useCase.execute({ tenantId, email, password });
  return reply.status(200).send({
    accessToken: result.accessToken,
    expiresIn: result.expiresIn,
  });
}
