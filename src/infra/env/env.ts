import { z } from 'zod';

export const envSchema = z
  .object({
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().optional().default(3000),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().optional().default('24h'),
    API_BASE_URL: z.string(),
    APP_NAME: z.string().optional().default('api-short-ul'),
    OTEL_ENABLED: z.enum(['true', 'false']).default('false'),
    OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
    OTEL_AUTH_HEADER_KEY: z.string().optional(),
    OTEL_AUTH_HEADER_VALUE: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.OTEL_ENABLED === 'true' && !env.OTEL_EXPORTER_OTLP_ENDPOINT) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'OTEL_EXPORTER_OTLP_ENDPOINT is required when OTEL_ENABLED is true.',
        path: ['OTEL_EXPORTER_OTLP_ENDPOINT'],
      });
    }
  });

export type Env = z.infer<typeof envSchema>;
