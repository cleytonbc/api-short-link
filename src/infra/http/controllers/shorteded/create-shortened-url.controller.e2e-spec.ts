import type { Server } from 'http';
import { describe, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppModule } from '@/app.module';
import { createAndAuthenticateUser } from '@test/helpers/auth-helpers';
import { ShortenedUrlPresenter } from '../../presenters/shortened-url.presenter';

type shortenedUrlResponse = ReturnType<typeof ShortenedUrlPresenter.toHTTP>;

describe('Criar url encurtada (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get<PrismaService>(PrismaService);

    await app.init();

    const { token, id } = await createAndAuthenticateUser(app, prismaService);
    authToken = token;
    userId = id;
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /shorten - sem autenticação', async () => {
    const data = {
      url: 'http://wwww.google.com',
    };

    const response = await request(app.getHttpServer() as Server)
      .post('/shorten')
      .send(data)
      .expect(201);

    const body = response.body as shortenedUrlResponse;

    expect(body).toHaveProperty('id');
    expect(body.originalUrl).toBe(data.url);

    const urlCreated = await prismaService.shortenedUrl.findUnique({
      where: { id: body.id },
    });

    expect(urlCreated).toBeTruthy();
    expect(urlCreated?.userId).toBeFalsy();
  }, 60000);

  test('[POST] /shorten - autenticado', async () => {
    const data = {
      url: 'http://wwww.google.com',
    };

    const response = await request(app.getHttpServer() as Server)
      .post('/shorten')
      .send(data)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    const body = response.body as shortenedUrlResponse;

    expect(body).toHaveProperty('id');
    expect(body.originalUrl).toBe(data.url);

    const urlCreated = await prismaService.shortenedUrl.findUnique({
      where: { id: body.id },
    });

    expect(urlCreated).toBeTruthy();
    expect(urlCreated?.userId).toBeTruthy();
    expect(urlCreated?.userId).toBe(userId);
  }, 60000);
});
