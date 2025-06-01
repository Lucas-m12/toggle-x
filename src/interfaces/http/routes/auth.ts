import { FastifyInstance } from 'fastify';

import { loginController } from '../controllers/user/login';
import { registerController } from '../controllers/user/register';
import { requestPasswordResetController } from '../controllers/user/request-password-reset';
import { verifyEmailController } from '../controllers/user/verify-email';

export const authRoutes = (app: FastifyInstance) => {
  app.post('/auth/register', registerController);
  app.post('/auth/login', loginController);
  app.post('/auth/verify-email', verifyEmailController);
  app.post('/auth/request-password-reset', requestPasswordResetController);
};
