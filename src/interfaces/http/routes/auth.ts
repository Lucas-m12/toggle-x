import { FastifyInstance } from 'fastify';

import { loginController } from '../controllers/user/login';
import { registerController } from '../controllers/user/register';

export const authRoutes = (app: FastifyInstance) => {
  app.post('/auth/register', registerController);

  app.get('/auth/login', loginController);
};
