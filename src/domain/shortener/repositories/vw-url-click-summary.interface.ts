import { PaginationResponse } from '@/core/interfaces/pagination-response';
import { VwUrlClicksSummary } from '../entities/vw-url-clicks-summary';

export interface IFindAllVwUrlClicksSummary {
  userId: string;
  shortenedUrlId?: string;
  shortCode?: string;
  clickDate?: Date;
  clickHour?: number;
  clickDateStart?: Date;
  clickDateEnd?: Date;
  minClickCount?: number;
  maxClickCount?: number;
  page?: number;
  pageSize?: number;
}
export abstract class IVwUrlClicksSummaryRepository {
  abstract findById(id: string): Promise<VwUrlClicksSummary | null>;
  abstract findAll(
    data: IFindAllVwUrlClicksSummary,
  ): Promise<PaginationResponse & { data: VwUrlClicksSummary[] }>;
}
