import { Module } from '@nestjs/common';
import { CreateShortenedUrlUseCase } from '@/domain/shortener/use-cases/create-shortened-url';
import { CreateShortenedUrlController } from './create-shortened-url.controller';
import { GenerateUniqueShortCodeService } from '@/domain/shortener/services/generate-unique-short-code.service';
import { GetUrlController } from './get-url.controller';
import { GetShortenedUrlUseCase } from '@/domain/shortener/use-cases/get-shortened-url';

@Module({
  controllers: [CreateShortenedUrlController, GetUrlController],
  providers: [
    CreateShortenedUrlUseCase,
    GenerateUniqueShortCodeService,
    GetShortenedUrlUseCase
  ],
})
export class ShortedModule {}
