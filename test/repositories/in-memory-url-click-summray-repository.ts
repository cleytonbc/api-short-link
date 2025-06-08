import { VwUrlClicksSummary } from '@/domain/shortener/entities/vw-url-clicks-summary';
import {
  IVwUrlClicksSummaryRepository,
  IFindAllVwUrlClicksSummary,
} from '@/domain/shortener/repositories/vw-url-click-summary.interface';
import { PaginationResponse } from '@/core/interfaces/pagination-response';

export class InMemoryVwUrlClicksSummaryRepository
  implements IVwUrlClicksSummaryRepository
{
  public items: VwUrlClicksSummary[] = [];

  async findById(id: string): Promise<VwUrlClicksSummary | null> {
    const item = this.items.find((item) => item.id.toString() === id);
    return Promise.resolve(item ?? null);
  }

  async findAll({
    userId,
    shortenedUrlId,
    shortCode,
    clickDate,
    clickHour,
    clickDateStart,
    clickDateEnd,
    minClickCount,
    maxClickCount,
    page = 1,
    pageSize = 10,
  }: IFindAllVwUrlClicksSummary): Promise<
    PaginationResponse & { data: VwUrlClicksSummary[] }
  > {
    let filtered = this.items.filter(
      (item) => item.userId.toString() === userId,
    );

    if (shortenedUrlId) {
      filtered = filtered.filter(
        (item) => item.shortenedUrlId?.toString() === shortenedUrlId,
      );
    }

    if (shortCode) {
      filtered = filtered.filter((item) => item.shortCode === shortCode);
    }

    if (clickDate) {
      filtered = filtered.filter(
        (item) =>
          item.clickDate.toISOString().split('T')[0] ===
          clickDate.toISOString().split('T')[0],
      );
    }

    if (clickDateStart || clickDateEnd) {
      filtered = filtered.filter((item) => {
        const date = item.clickDate;
        const afterStart = clickDateStart ? date >= clickDateStart : true;
        const beforeEnd = clickDateEnd ? date <= clickDateEnd : true;
        return afterStart && beforeEnd;
      });
    }

    if (clickHour !== undefined && clickHour !== null) {
      filtered = filtered.filter((item) => item.clickHour === clickHour);
    }

    if (minClickCount || maxClickCount) {
      filtered = filtered.filter((item) => {
        const count = item.clickCount;
        const aboveMin = minClickCount ? count >= minClickCount : true;
        const belowMax = maxClickCount ? count <= maxClickCount : true;
        return aboveMin && belowMax;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = await Promise.resolve(filtered.slice(start, end));

    return {
      total,
      totalPages,
      currentPage: page,
      data: paginatedData,
    };
  }

  async create(
    vwUrlClicksSummary: VwUrlClicksSummary,
  ): Promise<VwUrlClicksSummary> {
    this.items.push(vwUrlClicksSummary);
    return Promise.resolve(vwUrlClicksSummary);
  }
}
