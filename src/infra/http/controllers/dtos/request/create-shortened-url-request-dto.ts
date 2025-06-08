import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateShortenedUrlRequesSchema = z.object({
  url: z
    .string()
    .url({
      message: '"Please enter a valid URL, including https:// or http://." ',
    })
    .describe(
      'Endereço URL válido (Certifique-se de incluir https:// ou http://): exemplo https://www.google.com',
    ),
});

export class CreateShortenedUrlRequesDto extends createZodDto(
  CreateShortenedUrlRequesSchema,
) {}
