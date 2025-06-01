import { FastifyReply, FastifyRequest } from "fastify";

import { makeCreateProjectUseCase } from "@/infra/factories/use-cases/make-create-project";
import { createProjectSchema } from "../../schemas/create-project";

export const createProjectHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const parseResult = createProjectSchema.safeParse(request.body);

  if (!parseResult.success) {
    return reply.status(400).send({ error: parseResult.error.format() });
  }

  const { name } = parseResult.data;

  const createProject = makeCreateProjectUseCase();
  const { project } = await createProject.execute({
    tenantId: "tenant_x",
    name,
  });

  return reply.status(201).send(project);
};
