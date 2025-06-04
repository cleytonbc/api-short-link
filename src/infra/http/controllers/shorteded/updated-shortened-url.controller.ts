import { Body, Controller, HttpCode, Param, Put, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  ICurrentUser,
} from '@/infra/auth/decorators/current-user.decorator';
import { ShortenedUrlPresenter } from '../../presenters/shortened-url.presenter';
import { UpdateShortenedUrlRequesDto } from './dtos/update-shortened-url-dto';
import { JwtAuthGuard } from '@/infra/auth/guards/jwt-auth.guard';
import { UpdateShortenedUrlUseCase } from '@/domain/shortener/use-cases/update-shortened-url';

@UseGuards(JwtAuthGuard)
@Controller('/shorten')
export class UpdateShortenedUrlController {
  constructor(private updateShortenedUrlUseCase: UpdateShortenedUrlUseCase) {}

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async handle(
    @Param('id') id: string,
    @Body() body: UpdateShortenedUrlRequesDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    const { url } = body;

    const result = await this.updateShortenedUrlUseCase.execute({
      id,
      originalUrl: url,
      userId: user?.id,
    });

    return ShortenedUrlPresenter.toHTTP(result);
  }
}
