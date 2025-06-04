import type { Server } from 'http';
import { describe, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppModule } from '@/app.module';
import { ShortenedUrlFactory } from '@test/factories/make-shortened-url';

describe('Acessar url encurtada (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let shortenedUrlFactory: ShortenedUrlFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [ShortenedUrlFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    shortenedUrlFactory = moduleRef.get(ShortenedUrlFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[GET] /:code', async () => {
    const shortenedUrl = await shortenedUrlFactory.makePrismaUser();

    expect(shortenedUrl.clickCount).toBe(0);

    const code = shortenedUrl.shortCode;
    const response = await request(app.getHttpServer() as Server)
      .get(`/${code}`)
      .expect(302);

    expect(response.headers.location).toBe(shortenedUrl.originalUrl);

    const afterClick = await prismaService.shortenedUrl.findUnique({
      where: { id: shortenedUrl.id.toString() },
    });

    expect(afterClick?.clickCount).toBe(1);
  }, 60000);
});
