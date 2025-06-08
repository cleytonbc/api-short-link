import { PaginationResponse } from '@/core/interfaces/pagination-response';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@generated/prisma';
import {
  IFindAllVwUrlClicksSummary,
  IVwUrlClicksSummaryRepository,
} from '@/domain/shortener/repositories/vw-url-click-summary.interface';
import { VwUrlClicksSummary } from '@/domain/shortener/entities/vw-url-clicks-summary';
import { PrismaVwUrlClicksSummaryMapper } from '../mappers/prisma-vw-url-click-summary-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaVwUrlClicksSummaryRepository
  implements IVwUrlClicksSummaryRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<VwUrlClicksSummary | null> {
    const vwUrlClicksSummary = await this.prisma.vwUrlClicksSummary.findUnique({
      where: {
        id,
      },
    });

    if (!vwUrlClicksSummary) return null;

    return PrismaVwUrlClicksSummaryMapper.toDomain(vwUrlClicksSummary);
  }

  async findAll({
    userId,
    shortenedUrlId,
    shortCode,
    clickDate,
    clickDateStart,
    clickDateEnd,
    clickHour,
    minClickCount,
    maxClickCount,
    page = 1,
    pageSize = 10,
  }: IFindAllVwUrlClicksSummary): Promise<
    PaginationResponse & { data: VwUrlClicksSummary[] }
  > {
    const where: Prisma.VwUrlClicksSummaryWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (shortenedUrlId) {
      where.shortenedUrlId = shortenedUrlId;
    }

    if (shortCode) {
      where.shortCode = shortCode;
    }

    if (clickDate) {
      where.clickDate = clickDate;
    }

    if (clickDateStart || clickDateEnd) {
      where.clickDate = {};
      if (clickDateStart) {
        where.clickDate.gte = clickDateStart;
      }
      if (clickDateEnd) {
        where.clickDate.lte = clickDateEnd;
      }
    }

    if (clickHour !== undefined || clickHour !== null) {
      where.clickHour = clickHour;
    }

    if (minClickCount || maxClickCount) {
      where.clickCount = {};
      if (minClickCount) {
        where.clickCount.gte = minClickCount;
      }
      if (maxClickCount) {
        where.clickCount.lte = maxClickCount;
      }
    }

    const total = await this.prisma.vwUrlClicksSummary.count({ where });
    const results = await this.prisma.vwUrlClicksSummary.findMany({
      where,
      orderBy: { clickDate: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      total,
      totalPages,
      currentPage: page,
      data: results.map((item) =>
        PrismaVwUrlClicksSummaryMapper.toDomain(item),
      ),
    };
  }
}
