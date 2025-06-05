import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateUserRequesSchema = z.object({
  name: z.string().describe('Nome do usuário a ser criado'),
  email: z
    .string()
    .email()
    .describe(
      'E-mail do usuário a ser criado (É único, não deve existir no cadastro)',
    ),
  password: z
    .string()
    .min(6)
    .describe('Senha a ser cadastra. Deve ser no mínimo 6 caracteres'),
});

export class CreateUserRequesDto extends createZodDto(CreateUserRequesSchema) {}
