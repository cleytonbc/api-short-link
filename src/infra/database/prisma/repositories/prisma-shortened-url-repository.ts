import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IShortenedUrlRepository } from '@/domain/shortener/repositories/shortened-url-repository.interface';
import { ShortenedUrl } from '@/domain/shortener/entities/shortened-url';
import { PrismaShortenedUrlMapper } from '../mappers/prisma-shortened-url-mapper';
import { Prisma } from '@generated/prisma';
import { UrlClick } from '@/domain/shortener/entities/url-click';
import { PrismaUrlClickMapper } from '../mappers/prisma-url-click-mapper';

@Injectable()
export class PrismaShortenedRepository implements IShortenedUrlRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<ShortenedUrl | null> {
    const shortened = await this.prisma.shortenedUrl.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
    if (!shortened) {
      return null;
    }

    return PrismaShortenedUrlMapper.toDomain(shortened);
  }

  async findByShortCode(
    shortCode: string,
    includeDeleted = false,
  ): Promise<ShortenedUrl | null> {
    const whereClause: Prisma.ShortenedUrlWhereInput = {
      shortCode,
    };

    if (!includeDeleted) {
      whereClause.deletedAt = null;
    }
    const shortened = await this.prisma.shortenedUrl.findFirst({
      where: whereClause,
    });

    if (!shortened) {
      return null;
    }

    return PrismaShortenedUrlMapper.toDomain(shortened);
  }

  async findByUserId(userId: string): Promise<ShortenedUrl[]> {
    const shortenedUrls = await this.prisma.shortenedUrl.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });

    return shortenedUrls.map((shortened) =>
      PrismaShortenedUrlMapper.toDomain(shortened),
    );
  }

  async findAll(): Promise<ShortenedUrl[]> {
    const shortenedUrls = await this.prisma.shortenedUrl.findMany({
      where: {
        deletedAt: null,
      },
    });

    return shortenedUrls.map((shortened) =>
      PrismaShortenedUrlMapper.toDomain(shortened),
    );
  }

  async incrementClickCountAndCreateUrlClick(
    id: string,
    urlClick: UrlClick,
  ): Promise<ShortenedUrl | null> {
    const shortened = await this.prisma.$transaction(async (tx) => {
      const updatedUrl = await tx.shortenedUrl.update({
        where: { id },
        data: {
          clickCount: {
            increment: 1,
          },
        },
      });

      const data = PrismaUrlClickMapper.toPrisma(urlClick);
      await tx.urlClick.create({
        data,
      });

      return updatedUrl;
    });

    if (!shortened) {
      return null;
    }

    return PrismaShortenedUrlMapper.toDomain(shortened);
  }

  async create(shortenedUrl: ShortenedUrl): Promise<ShortenedUrl> {
    const data = PrismaShortenedUrlMapper.toPrisma(shortenedUrl);
    const createdShortenedUrl = await this.prisma.shortenedUrl.create({
      data,
    });

    return PrismaShortenedUrlMapper.toDomain(createdShortenedUrl);
  }

  async save(shortenedUrl: ShortenedUrl): Promise<void> {
    const data = PrismaShortenedUrlMapper.toPrisma(shortenedUrl);
    await this.prisma.shortenedUrl.update({
      where: {
        id: shortenedUrl.id.toString(),
      },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shortenedUrl.delete({ where: { id } });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.shortenedUrl.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
