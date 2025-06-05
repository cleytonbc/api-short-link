import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateShortenedUrlRequesSchema = z.object({
  url: z.string().url().describe('Endereço URL'),
});

export class UpdateShortenedUrlRequesDto extends createZodDto(
  UpdateShortenedUrlRequesSchema,
) {}
