import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3000),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().optional().default('24h'),
});

export type Env = z.infer<typeof envSchema>;
