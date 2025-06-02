import type { Server } from 'http';
import { describe, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppModule } from '@/app.module';
import { UserPresenter } from '../../presenters/user.presenter';

type UserResponse = ReturnType<typeof UserPresenter.toHTTP>;

describe('Criar usuário (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /users', async () => {
    const user = {
      name: 'José',
      email: 'jose@email.com',
      password: '123456',
    };

    const response = await request(app.getHttpServer() as Server)
      .post('/users')
      .send(user)
      .expect(201);

    const body = response.body as UserResponse;

    expect(body).toHaveProperty('id');
    expect(body.name).toBe(user.name);
    expect(body.email).toBe(user.email);
    expect(body).not.toHaveProperty('password');

    const userCreated = await prismaService.user.findUnique({
      where: { id: body.id },
    });

    expect(userCreated).toBeTruthy();
  }, 60000);
});
