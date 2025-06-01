import { z } from 'zod';

export const registerUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    tenantId: z.string().min(1),
});
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
