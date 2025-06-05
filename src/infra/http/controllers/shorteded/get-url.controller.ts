import { Controller, Get, HttpCode, Param, Res } from '@nestjs/common';
import { GetShortenedUrlUseCase } from '@/domain/shortener/use-cases/get-shortened-url';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { SWAGGER_API_TAGS } from '@/infra/swagger/tags';

@Controller('/:code')
export class GetUrlController {
  constructor(private getShortenedUrlUseCase: GetShortenedUrlUseCase) {}

  @Get()
  @HttpCode(302)
  @ApiOperation({
    summary: 'Acessar a URL que foi encurtada',
    tags: [SWAGGER_API_TAGS.LINK],
  })
  @ApiBadRequestResponse({
    description: 'Invalid data or incorrect parameters',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or expired token',
  })
  @ApiFoundResponse({
    description:
      'Será redirecionado automaticamente para a URL do link encurtado',
  })
  @ApiNotFoundResponse({ description: 'URL not found' })
  async handle(@Param('code') code: string, @Res() res: Response) {
    const result = await this.getShortenedUrlUseCase.execute(code);

    return res.redirect(result);
  }
}
