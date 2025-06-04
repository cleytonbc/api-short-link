import { Module } from '@nestjs/common';
import { CreateShortenedUrlUseCase } from '@/domain/shortener/use-cases/create-shortened-url';
import { CreateShortenedUrlController } from './create-shortened-url.controller';
import { GenerateUniqueShortCodeService } from '@/domain/shortener/services/generate-unique-short-code.service';

@Module({
  controllers: [CreateShortenedUrlController, ],
  providers: [
    CreateShortenedUrlUseCase,
    GenerateUniqueShortCodeService,
  ],
})
export class ShortedModule {}
