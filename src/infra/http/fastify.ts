import { projectRoutes } from "@/interfaces/http/routes/project";
import Fastify from "fastify";
import { errorHandler } from "./middlewares/error-handler";

const app = Fastify();
app.register(projectRoutes);

app.setErrorHandler(errorHandler);

export { app };
