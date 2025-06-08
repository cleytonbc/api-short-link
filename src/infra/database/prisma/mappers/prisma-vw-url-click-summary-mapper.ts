import { VwUrlClicksSummary as PrismaVwUrlClicksSummary } from '@generated/prisma';
import { VwUrlClicksSummary } from '@/domain/shortener/entities/vw-url-clicks-summary';

export class PrismaVwUrlClicksSummaryMapper {
  static toDomain(raw: PrismaVwUrlClicksSummary): VwUrlClicksSummary {
    return VwUrlClicksSummary.create({
      id: raw.id,
      userId: raw.userId,
      shortenedUrlId: raw.shortenedUrlId,
      shortCode: raw.shortCode,
      originalUrl: raw.originalUrl,
      userEmail: raw.userEmail,
      userName: raw.userName,
      clickDate: raw.clickDate,
      clickHour: raw.clickHour,
      clickCount: Number(raw.clickCount),
      createdAt: raw.createdAt,
    });
  }
}
