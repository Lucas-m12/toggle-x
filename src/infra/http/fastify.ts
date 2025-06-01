import * as routes from "@/interfaces/http/routes";
import Fastify from "fastify";
import { errorHandler } from "./middlewares/error-handler";

const app = Fastify();

app.register(routes.projectRoutes);
app.register(routes.authRoutes);

app.setErrorHandler(errorHandler);

export { app };
