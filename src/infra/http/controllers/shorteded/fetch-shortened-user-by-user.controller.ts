import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  ICurrentUser,
} from '@/infra/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/guards/jwt-auth.guard';
import { ShortenedUrlPresenter } from '../../presenters/shortened-url.presenter';
import { FetchShortenedUrlByIdUseCase } from '@/domain/shortener/use-cases/fetch-shortened-url-by-user';
import { ApiOperation } from '@nestjs/swagger';
import { SWAGGER_API_TAGS } from '@/infra/swagger/tags';
import { ApiGetEndpoint } from '@/infra/swagger/api-response-default.decorator';
import { ShortenedUrlResponseDto } from '../dtos/response/shortened-url-response-dto';

@Controller('/shorten')
export class FetchShortenedUrlByIdController {
  constructor(
    private fetchShortenedUrlByUserIdUseCase: FetchShortenedUrlByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Lista toda as URL encurtadas criada pelo usuário autenticado',
    tags: [SWAGGER_API_TAGS.SHORTEN],
  })
  @ApiGetEndpoint([ShortenedUrlResponseDto])
  async handle(@CurrentUser() user: ICurrentUser) {
    const userId = user.id;
    const result = await this.fetchShortenedUrlByUserIdUseCase.execute(userId);

    return result.map((shortenedUrl) =>
      ShortenedUrlPresenter.toHTTP(shortenedUrl),
    );
  }
}
