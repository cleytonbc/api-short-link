import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  ICurrentUser,
} from '@/infra/auth/decorators/current-user.decorator';

import { JwtAuthGuard } from '@/infra/auth/guards/jwt-auth.guard';
import { DeleteShortenedUrlUseCase } from '@/domain/shortener/use-cases/delete-shortened-url';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { SWAGGER_API_TAGS } from '@/infra/swagger/tags';
import { ApiDeleteEndpoint } from '@/infra/swagger/api-response-default.decorator';

@UseGuards(JwtAuthGuard)
@Controller('/shorten')
export class DeleteShortenedUrlController {
  constructor(private deleteShortenedUrlUseCase: DeleteShortenedUrlUseCase) {}

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Excluir uma URL encurtada pelo ID',
    tags: [SWAGGER_API_TAGS.SHORTEN],
  })
  @ApiParam({
    name: 'id',
    description: 'ID da URL a ser excluída',
    required: true,
  })
  @ApiDeleteEndpoint()
  async handle(@Param('id') id: string, @CurrentUser() user: ICurrentUser) {
    await this.deleteShortenedUrlUseCase.execute({
      id,
      userId: user.id,
    });

    return;
  }
}
