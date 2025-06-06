import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IUrlClickRepository } from '@/domain/shortener/repositories/url-click-repository.interface';
import { UrlClick } from '@/domain/shortener/entities/url-click';
import { PrismaUrlClickMapper } from '../mappers/prisma-url-click-mapper';

@Injectable()
export class PrismaUrlClickRepository implements IUrlClickRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<UrlClick | null> {
    const urlClick = await this.prisma.urlClick.findUnique({
      where: {
        id,
      },
    });
    if (!urlClick) {
      return null;
    }

    return PrismaUrlClickMapper.toDomain(urlClick);
  }

  async findByShortenedUrlId(shortenedUrlId: string): Promise<UrlClick[]> {
    const urls = await this.prisma.urlClick.findMany({
      where: {
        shortenedUrlId,
      },
    });

    return urls.map((url) => PrismaUrlClickMapper.toDomain(url));
  }

  async create(urlClick: UrlClick): Promise<UrlClick> {
    const data = PrismaUrlClickMapper.toPrisma(urlClick);

    const urlClickCreated = await this.prisma.$transaction(async (tx) => {
      await tx.shortenedUrl.update({
        where: { id: data.shortenedUrlId, deletedAt: null },
        data: {
          clickCount: {
            increment: 1,
          },
        },
      });

      const clickCreated = await tx.urlClick.create({
        data,
      });

      return clickCreated;
    });

    return PrismaUrlClickMapper.toDomain(urlClickCreated);
  }
}
