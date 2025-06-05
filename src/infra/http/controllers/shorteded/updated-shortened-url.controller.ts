import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  ICurrentUser,
} from '@/infra/auth/decorators/current-user.decorator';
import { ShortenedUrlPresenter } from '../../presenters/shortened-url.presenter';
import { UpdateShortenedUrlRequesDto } from '../dtos/request/update-shortened-url-request-dto';
import { JwtAuthGuard } from '@/infra/auth/guards/jwt-auth.guard';
import { UpdateShortenedUrlUseCase } from '@/domain/shortener/use-cases/update-shortened-url';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { SWAGGER_API_TAGS } from '@/infra/swagger/tags';
import { ApiUpdateEndpoint } from '@/infra/swagger/api-response-default.decorator';
import { ShortenedUrlResponseDto } from '../dtos/response/shortened-url-response-dto';

@UseGuards(JwtAuthGuard)
@Controller('/shorten')
export class UpdateShortenedUrlController {
  constructor(private updateShortenedUrlUseCase: UpdateShortenedUrlUseCase) {}

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Atualizar uma URL encurtada',
    tags: [SWAGGER_API_TAGS.SHORTEN],
  })
  @ApiParam({
    name: 'id',
    description: 'ID da URL encurtada',
    required: true,
  })
  @ApiUpdateEndpoint(ShortenedUrlResponseDto)
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
