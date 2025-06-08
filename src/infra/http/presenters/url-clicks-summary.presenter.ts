import { VwUrlClicksSummary } from '@/domain/shortener/entities/vw-url-clicks-summary';

export class UrlClicksSummaryPresenter {
  static toHTTP(urlClickSummary: VwUrlClicksSummary) {
    return {
      id: urlClickSummary.id,
      userId: urlClickSummary.userId,
      shortenedUrlId: urlClickSummary.shortenedUrlId,
      shortCode: urlClickSummary.shortCode,
      originalUrl: urlClickSummary.originalUrl,
      userEmail: urlClickSummary.userEmail,
      userName: urlClickSummary.userName,
      clickDate: urlClickSummary.clickDate,
      clickHour: urlClickSummary.clickHour,
      clickCount: urlClickSummary.clickCount,
      createdAt: urlClickSummary.createdAt,
    };
  }
}
