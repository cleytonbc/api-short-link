import { Body, Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  ICurrentUser,
} from '@/infra/auth/decorators/current-user.decorator';
import { ShortenedUrlPresenter } from '../../presenters/shortened-url.presenter';
import { UpdateShortenedUrlRequesDto } from './dtos/update-shortened-url-dto';
import { JwtAuthGuard } from '@/infra/auth/guards/jwt-auth.guard';
import { DeleteShortenedUrlUseCase } from '@/domain/shortener/use-cases/delete-shortened-url';

@UseGuards(JwtAuthGuard)
@Controller('/shorten')
export class DeleteShortenedUrlController {
  constructor(private deleteShortenedUrlUseCase: DeleteShortenedUrlUseCase) {}

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: ICurrentUser,
  ) {

    await this.deleteShortenedUrlUseCase.execute({
      id,
      userId: user.id,
    });

    return 
  }
}
