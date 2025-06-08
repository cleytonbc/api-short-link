import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@/domain/users/repositories/user-repository.interface';
import { UserDoesNotExistError } from '../errors/user-not-found-error';
import { VwUrlClicksSummary } from '../entities/vw-url-clicks-summary';
import { IVwUrlClicksSummaryRepository } from '../repositories/vw-url-click-summary.interface';
import { PaginationResponse } from '@/core/interfaces/pagination-response';

export interface IFetchUrlClicksSummaryByUserUseCase {
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
@Injectable()
export class FetchUrlClicksSummaryByUserUseCase {
  constructor(
    private vwUrlClicksSummaryRepository: IVwUrlClicksSummaryRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    userId,
    clickDate,
    clickDateEnd,
    clickDateStart,
    clickHour,
    maxClickCount,
    minClickCount,
    shortCode,
    shortenedUrlId,
    page = 1,
    pageSize = 100,
  }: IFetchUrlClicksSummaryByUserUseCase): Promise<
    PaginationResponse & { vwUrlClicksSummaries: VwUrlClicksSummary[] }
  > {
    const userExist = await this.userRepository.findById(userId);

    if (!userExist) {
      throw new UserDoesNotExistError();
    }

    const {
      currentPage,
      total,
      totalPages,
      data: vwUrlClicksSummaries,
    } = await this.vwUrlClicksSummaryRepository.findAll({
      userId,
      clickDate,
      clickDateEnd,
      clickDateStart,
      clickHour,
      maxClickCount,
      minClickCount,
      shortCode,
      shortenedUrlId,
      page,
      pageSize,
    });

    return {
      currentPage,
      total,
      totalPages,
      vwUrlClicksSummaries,
    };
  }
}
