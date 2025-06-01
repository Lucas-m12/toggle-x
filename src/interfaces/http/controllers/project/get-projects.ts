import { FastifyReply, FastifyRequest } from "fastify";

import { makeGetAllProjectsUseCase } from "@/infra/factories/use-cases/make-get-all-projects";

export const getProjectsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const tenantId = "mocked_tenant_id"; // Replace with actual tenant ID retrieval logic
  const getAllProjects = makeGetAllProjectsUseCase();
  const result = await getAllProjects.execute({
    tenantId,
  });
  return reply.status(200).send(result);
};
