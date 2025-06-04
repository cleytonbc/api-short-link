import { Controller, Get, HttpCode, Param, Res } from '@nestjs/common';
import { GetShortenedUrlUseCase } from '@/domain/shortener/use-cases/get-shortened-url';
import { Response } from 'express';

@Controller('/:code')
export class GetUrlController {
  constructor(private getShortenedUrlUseCase: GetShortenedUrlUseCase) {}

  @Get()
  @HttpCode(302)
  async handle(@Param('code') code: string, @Res() res: Response) {
    const result = await this.getShortenedUrlUseCase.execute(code);

    return res.redirect(result);
  }
}
