import { AppError } from "@/core/errors/app-error";
import { ProjectNameAlreadyExistsError } from "@/domain/projects/errors/project-name-already-exists";
import { UserAlreadyExistsError } from "@/domain/user/errors/user-already-exist";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";


export function errorHandler(
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ProjectNameAlreadyExistsError) {
    return reply.status(409).send({ error: error.message });
  }

  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ error: error.message });
  }

  if (error instanceof AppError) {
    return reply.status(400).send({ error: error.message });
  }

  console.error(error);
  return reply.status(500).send({ error: "Erro interno no servidor" });
}
