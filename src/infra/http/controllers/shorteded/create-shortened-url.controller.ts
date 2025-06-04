import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CreateShortenedUrlUseCase } from '@/domain/shortener/use-cases/create-shortened-url';
import { CreateShortenedUrlRequesDto } from './dtos/create-shortened-url-dto';
import { OptionalAuthGuard } from '@/infra/auth/guards/optional-auth.guard';
import {
  CurrentUser,
  ICurrentUser,
} from '@/infra/auth/decorators/current-user.decorator';
import { ShortenedUrlPresenter } from '../../presenters/shortened-url.presenter';

@UseGuards(OptionalAuthGuard)
@Controller('/shorten')
export class CreateShortenedUrlController {
  constructor(private createShortenedUrlUseCase: CreateShortenedUrlUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body() body: CreateShortenedUrlRequesDto,
    @CurrentUser() user: ICurrentUser | null,
  ) {
    const { url } = body;

    const result = await this.createShortenedUrlUseCase.execute({
      originalUrl: url,
      userId: user?.id,
    });

    return ShortenedUrlPresenter.toHTTP(result);
  }
}
