import {
  ShortenedUrl as PrismaShortenedUrl,
  Prisma,
} from '@generated/prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ShortenedUrl } from '@/domain/shortener/entities/shortened-url';

export class PrismaShortenedUrlMapper {
  static toDomain(raw: PrismaShortenedUrl): ShortenedUrl {
    return ShortenedUrl.create(
      {
        shortCode: raw.shortCode,
        originalUrl: raw.originalUrl,
        clickCount: raw.clickCount,
        userId: raw.userId ? new UniqueEntityID(raw.userId) : undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    shortenedUrl: ShortenedUrl,
  ): Prisma.ShortenedUrlUncheckedCreateInput {
    return {
      id: shortenedUrl.id.toString(),
      shortCode: shortenedUrl.shortCode,
      originalUrl: shortenedUrl.originalUrl,
      clickCount: shortenedUrl.clickCount,
      userId: shortenedUrl.userId?.toString(),
      createdAt: shortenedUrl.createdAt,
      updatedAt: shortenedUrl.updatedAt ?? null,
      deletedAt: shortenedUrl.deletedAt ?? null,
    };
  }
}
