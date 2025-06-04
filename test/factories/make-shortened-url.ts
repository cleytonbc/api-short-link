import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ShortenedUrl } from '@/domain/shortener/entities/shortened-url';
import { PrismaShortenedUrlMapper } from '@/infra/database/prisma/mappers/prisma-shortened-url-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

type Override = Partial<{
  shortCode: string;
  originalUrl: string;
  userId?: UniqueEntityID;
  clickCount: number;
  updatedAt?: Date
}>;

export function makeShortenedUrl(
  override: Override = {},
  id?: UniqueEntityID,
): ShortenedUrl {
  return ShortenedUrl.create(
    {
      shortCode: override.shortCode ?? faker.string.nanoid(6),
      originalUrl: override.originalUrl ?? faker.internet.url(),
      clickCount: override.clickCount ?? 0,
      userId: override.userId ?? undefined,
      updatedAt: override.updatedAt ?? new Date()
    },
    id,
  );
}

@Injectable()
export class ShortenedUrlFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(
    data: Override = {},
    id?: UniqueEntityID,
  ): Promise<ShortenedUrl> {
    const shortenedUrl = makeShortenedUrl(data, id);

    await this.prisma.shortenedUrl.create({
      data: PrismaShortenedUrlMapper.toPrisma(shortenedUrl),
    });

    return shortenedUrl;
  }
}
