import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CreateShortenedUrlUseCase } from '@/domain/shortener/use-cases/create-shortened-url';
import { CreateShortenedUrlRequesDto } from '../dtos/request/create-shortened-url-request-dto';
import { OptionalAuthGuard } from '@/infra/auth/guards/optional-auth.guard';
import {
  CurrentUser,
  ICurrentUser,
} from '@/infra/auth/decorators/current-user.decorator';
import { ShortenedUrlPresenter } from '../../presenters/shortened-url.presenter';
import { SWAGGER_API_TAGS } from '@/infra/swagger/tags';
import { ApiCreateEndpoint } from '@/infra/swagger/api-response-default.decorator';
import { ShortenedUrlResponseDto } from '../dtos/response/shortened-url-response-dto';
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(OptionalAuthGuard)
@Controller('/shorten')
export class CreateShortenedUrlController {
  constructor(private createShortenedUrlUseCase: CreateShortenedUrlUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Criar uma nova URL encurtada',
    tags: [SWAGGER_API_TAGS.SHORTEN],
    description:
      'Cria uma nova URL encurtada, sendo que a autenticação é opcional, mas caso autenticado, registra a URL como sendo do usuário logadoCria uma nova URL encurtada. Se a requisição for autenticada, a URL será vinculada ao usuário logado; caso contrário, será registrada sem associação a um usuário.',
  })
  @ApiCreateEndpoint<ShortenedUrlResponseDto>(ShortenedUrlResponseDto)
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
