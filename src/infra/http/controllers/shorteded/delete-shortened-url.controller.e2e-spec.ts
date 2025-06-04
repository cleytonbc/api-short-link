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

describe('Excluir url encurtada (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let shortenedUrlFactory: ShortenedUrlFactory;
  let authToken: string;
  let userId: string;

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

  test('[DELETE] /shorten/:id', async () => {
    const shortenedUrl = await shortenedUrlFactory.makePrismaUser({
      originalUrl: 'https://www.google.com',
      userId: new UniqueEntityID(userId),
    });

    const id = shortenedUrl.id.toValue();
    await request(app.getHttpServer() as Server)
      .delete(`/shorten/${id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);

    const deletedUrl = await prismaService.shortenedUrl.findUnique({
      where: { id: shortenedUrl.id.toString() },
    });

    expect(deletedUrl?.deletedAt).toBeDefined();
  }, 60000);
});
