import { FastifyInstance } from 'fastify';

import { loginController } from '../controllers/user/login';
import { registerController } from '../controllers/user/register';
import { verifyEmailController } from '../controllers/user/verify-email';

export const authRoutes = (app: FastifyInstance) => {
  app.post('/auth/register', registerController);
  app.get('/auth/login', loginController);
  app.get('/auth/verify-email', verifyEmailController);
};
