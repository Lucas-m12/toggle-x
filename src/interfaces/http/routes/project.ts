import { FastifyInstance } from "fastify";
import { createProjectHandler } from "../controllers/project/create-project";
import { getProjectsHandler } from "../controllers/project/get-projects";

export const projectRoutes = (app: FastifyInstance) => {
  app.post("/admin/projects", createProjectHandler);

  app.get('/admin/projects', getProjectsHandler);
}
