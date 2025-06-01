import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    tenantId: z.string().min(1),
  }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
