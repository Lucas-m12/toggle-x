import "dotenv/config";
import { app } from "./infra/http/fastify";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

app
  .listen({ port: PORT })
  .then(() => {
    console.log(`🚀 HTTP server running on http://localhost:${PORT}`);
  })
  .catch((err) => {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  });
