import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateShortenedUrlRequesSchema = z.object({
  url: z.string().url().describe('Endereço URL'),
});

export class CreateShortenedUrlRequesDto extends createZodDto(
  CreateShortenedUrlRequesSchema,
) {}
