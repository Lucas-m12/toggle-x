import { FastifyRequest, FastifyReply } from 'fastify';
import { registerUserSchema } from '../../schemas/user/register-user';
import { makeRegisterUserUseCase } from '@/infra/factories/use-cases/user/make-register-user';

export async function registerController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const parseResult = registerUserSchema.safeParse(req.body);
  if (!parseResult.success) {
    return reply.status(400).send({ error: parseResult.error.format() });
  }
  const { name, email, password, tenantId } = parseResult.data;
  const useCase = makeRegisterUserUseCase();
  await useCase.execute({ tenantId, name, email, password });
  return reply.status(201).send();
}
