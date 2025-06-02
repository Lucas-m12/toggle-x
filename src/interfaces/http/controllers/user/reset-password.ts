import { makeResetPasswordUseCase } from '@/infra/factories/use-cases/user/make-reset-password';
import { FastifyReply, FastifyRequest } from 'fastify';
import { resetPasswordSchema } from '../../schemas/user/reset-password';

export async function resetPasswordController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.format() });
  }
  const { token, newPassword } = parsed.data;
  const useCase = makeResetPasswordUseCase();
  await useCase.execute({ token, newPassword });
  return reply.status(204).send();
}
