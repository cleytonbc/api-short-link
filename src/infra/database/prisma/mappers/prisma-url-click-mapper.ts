import { UrlClick as PrismaUrlClick, Prisma } from '@generated/prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UrlClick } from '@/domain/shortener/entities/url-click';

export class PrismaUrlClickMapper {
  static toDomain(raw: PrismaUrlClick): UrlClick {
    return UrlClick.create(
      {
        shortenedUrlId: new UniqueEntityID(raw.shortenedUrlId),
        clickedAt: raw.clickedAt,
        ipAddress: raw.ipAddress,
        userAgent: raw.userAgent,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(shortenedUrl: UrlClick): Prisma.UrlClickUncheckedCreateInput {
    return {
      id: shortenedUrl.id.toString(),
      shortenedUrlId: shortenedUrl.shortenedUrlId?.toString(),
      clickedAt: shortenedUrl.clickedAt,
      ipAddress: shortenedUrl.ipAddress,
      userAgent: shortenedUrl.userAgent,
    };
  }
}
