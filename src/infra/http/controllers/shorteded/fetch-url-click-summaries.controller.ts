import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  ICurrentUser,
} from '@/infra/auth/decorators/current-user.decorator';
import { SWAGGER_API_TAGS } from '@/infra/swagger/tags';
import { ApiOperation } from '@nestjs/swagger';
import { FetchUrlClicksSummaryByUserUseCase } from '@/domain/shortener/use-cases/fetch-url-click-summary';
import {
  FetchUrlClicksSummaryQueryDto,
  FetchUrlClicksSummaryQuerySchema,
} from '../dtos/request/fetch-url-clicks-sumarry-request-dto';
import { UrlClicksSummaryPresenter } from '../../presenters/url-clicks-summary.presenter';
import { JwtAuthGuard } from '@/infra/auth/guards/jwt-auth.guard';
import { ApiQueries } from '@/infra/swagger/api-queries.decorator';
import { ApiGetEndpoint } from '@/infra/swagger/api-response-default.decorator';
import { PaginatedClickSummaryResponseResponseDTO } from '../dtos/response/url-click-summary-response-dto';

@UseGuards(JwtAuthGuard)
@Controller('/analytics')
export class FetchUrlClicksSummaryController {
  constructor(
    private fetchUrlClicksSummaryByUserUseCase: FetchUrlClicksSummaryByUserUseCase,
  ) {}

  @Get('/clicks-summary')
  @ApiOperation({
    summary: 'Obter resumo de cliques criado pelo usuário',
    tags: [SWAGGER_API_TAGS.ANALYTICS],
    description:
      'Retorna o resumo de cliques para URLs do usuário com filtros opcionais.',
  })
  @ApiQueries(FetchUrlClicksSummaryQuerySchema)
  @ApiGetEndpoint(PaginatedClickSummaryResponseResponseDTO)
  async handle(
    @Query() query: FetchUrlClicksSummaryQueryDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    const { currentPage, total, totalPages, vwUrlClicksSummaries } =
      await this.fetchUrlClicksSummaryByUserUseCase.execute({
        ...query,
        userId: user.id,
      });

    return {
      total,
      currentPage,
      totalPages,
      data: vwUrlClicksSummaries.map((urlClick) =>
        UrlClicksSummaryPresenter.toHTTP(urlClick),
      ),
    };
  }
}
