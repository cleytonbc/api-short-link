import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.string().email().describe('Email do usuário'),
  password: z.string().describe('Senha do usuário'),
});

export class LoginDto extends createZodDto(LoginRequestSchema) {}
