import type { Server } from 'http';
import { describe, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppModule } from '@/app.module';
import { ShortenedUrlFactory } from '@test/factories/make-shortened-url';
import { ShortenedUrlPresenter } from '../../presenters/shortened-url.presenter';
import { createAndAuthenticateUser } from '@test/helpers/auth-helpers';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

describe('Listar urls de um usuário (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let shortenedUrlFactory: ShortenedUrlFactory;
  let authToken: string;
  let userId: string;

  type shortenedUrlResponse = ReturnType<typeof ShortenedUrlPresenter.toHTTP>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [ShortenedUrlFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    shortenedUrlFactory = moduleRef.get(ShortenedUrlFactory);

    await app.init();

    const { token, id } = await createAndAuthenticateUser(app, prismaService);
    authToken = token;
    userId = id;
  });

  afterAll(async () => {
    await app.close();
  });

  test('[GET] /shorten/:id', async () => {
    await shortenedUrlFactory.makePrismaUser({
      originalUrl: 'https://www.google.com',
      userId: new UniqueEntityID(userId),
    });
    await shortenedUrlFactory.makePrismaUser({
      originalUrl: 'https://www.google.com',
      userId: new UniqueEntityID(userId),
    });

    const response = await request(app.getHttpServer() as Server)
      .get(`/shorten`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const body = response.body as shortenedUrlResponse[];

    expect(body).toHaveLength(2);

    for (const item of body) {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('userId');
      expect(item.userId).toBe(userId);
    }
  }, 60000);
});
