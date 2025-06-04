import type { Server } from 'http';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export async function createAndAuthenticateUser(
  app: INestApplication,
  prisma: PrismaService,
): Promise<{ token: string; id: string }> {
  const email = 'auth@example.com';
  const password = '123456';

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Test User',
    },
  });

  const response = await request(app.getHttpServer() as Server)
    .post('/auth/login')
    .send({ email, password });

  type IBody = { access_token: string; user: { id: string } };
  const body = response.body as IBody;

  const token: string = body?.access_token;
  const id: string = body?.user?.id;

  if (typeof token !== 'string') {
    throw new Error('Token not returned');
  }

  return { token, id };
}
