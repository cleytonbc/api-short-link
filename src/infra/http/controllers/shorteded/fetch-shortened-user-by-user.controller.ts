import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  ICurrentUser,
} from '@/infra/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/guards/jwt-auth.guard';
import { ShortenedUrlPresenter } from '../../presenters/shortened-url.presenter';
import { FetchShortenedUrlByIdUseCase } from '@/domain/shortener/use-cases/fetch-shortened-url-by-user';

@Controller('/shorten')
export class FetchShortenedUrlByIdController {
  constructor(
    private fetchShortenedUrlByUserIdUseCase: FetchShortenedUrlByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async handle(@CurrentUser() user: ICurrentUser) {
    const userId = user.id;
    const result = await this.fetchShortenedUrlByUserIdUseCase.execute(userId);

    return result.map((shortenedUrl) =>
      ShortenedUrlPresenter.toHTTP(shortenedUrl),
    );
  }
}
