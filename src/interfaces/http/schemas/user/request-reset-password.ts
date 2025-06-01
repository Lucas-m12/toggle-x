import { z } from "zod";

export const requestPasswordResetSchema = z.object({
  tenantId: z.string().min(1),
  email: z.string().email(),
  baseUrl: z.string().url().optional(),
});
