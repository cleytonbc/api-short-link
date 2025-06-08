import type { Server } from 'http';
import { describe, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppModule } from '@/app.module';
import { ShortenedUrlFactory } from '@test/factories/make-shortened-url';
import { createAndAuthenticateUser } from '@test/helpers/auth-helpers';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UrlClicksSummaryPresenter } from '../../presenters/url-clicks-summary.presenter';

describe('Listar resumo de cliques de uma url encurtada (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let shortenedUrlFactory: ShortenedUrlFactory;
  let authToken: string;
  let userId: string;

  type dataResponse = ReturnType<typeof UrlClicksSummaryPresenter.toHTTP>;
  type urlClickResponse = {
    total: number;
    currentPage: number;
    totalPages: number;
    data: dataResponse[];
  };

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
    const url1 = await shortenedUrlFactory.makePrismaUser({
      originalUrl: 'https://www.google.com',
      userId: new UniqueEntityID(userId),
    });
    const url2 = await shortenedUrlFactory.makePrismaUser({
      originalUrl: 'https://www.google.com',
      userId: new UniqueEntityID(userId),
    });

    console.log('url1.shortCode', url1.shortCode);
    await request(app.getHttpServer() as Server)
      .get(`/${url1.shortCode}`)
      .expect(302);
    await request(app.getHttpServer() as Server)
      .get(`/${url1.shortCode}`)
      .expect(302);
    await request(app.getHttpServer() as Server)
      .get(`/${url2.shortCode}`)
      .expect(302);

    const response = await request(app.getHttpServer() as Server)
      .get(`/analytics/clicks-summary`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const body = response.body as urlClickResponse;

    expect(body.total).toBe(2);
    expect(body.currentPage).toBe(1);
    expect(body.totalPages).toBe(1);
    expect(body.data).toHaveLength(2);

    for (const item of body.data) {
      if (item.shortCode === url1.shortCode) {
        expect(item.clickCount).toBe(2);
      }
      if (item.shortCode === url2.shortCode) {
        expect(item.clickCount).toBe(1);
      }
    }
  }, 60000);
});
