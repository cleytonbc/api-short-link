import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const FetchUrlClicksSummaryQuerySchema = z.object({
  shortenedUrlId: z.string().uuid().optional().describe('ID da URL encurtada'),
  shortCode: z.string().optional().describe('Código encurtado'),
  clickDate: z.coerce
    .date()
    .optional()
    .describe('Data exata do clique - formato YYYY-MM-DD exemplo: 2025-06-08'),
  clickHour: z.coerce
    .number()
    .int()
    .min(0)
    .max(23)
    .optional()
    .describe(
      'Hora do clique, somente hora, sem minutos. Exemplo: 1 ou 2 ou 13 ou 14 ...',
    ),
  clickDateStart: z.coerce
    .date()
    .optional()
    .describe(
      'Data inicial do filtro  - formato YYYY-MM-DD exemplo: 2025-06-08',
    ),
  clickDateEnd: z.coerce
    .date()
    .optional()
    .describe('Data final do filtro - formato YYYY-MM-DD exemplo: 2025-06-08'),
  minClickCount: z.coerce
    .number()
    .int()
    .optional()
    .describe('Número mínimo de cliques'),
  maxClickCount: z.coerce
    .number()
    .int()
    .optional()
    .describe('Número máximo de cliques'),
  page: z.coerce
    .number()
    .int()
    .min(1)
    .optional()
    .default(1)
    .describe('Página atual'),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(100)
    .describe('Itens por página'),
});

export class FetchUrlClicksSummaryQueryDto extends createZodDto(
  FetchUrlClicksSummaryQuerySchema,
) {}
