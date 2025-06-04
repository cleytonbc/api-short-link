import { Module } from '@nestjs/common';
import { CreateShortenedUrlUseCase } from '@/domain/shortener/use-cases/create-shortened-url';
import { CreateShortenedUrlController } from './create-shortened-url.controller';
import { GenerateUniqueShortCodeService } from '@/domain/shortener/services/generate-unique-short-code.service';
import { GetUrlController } from './get-url.controller';
import { GetShortenedUrlUseCase } from '@/domain/shortener/use-cases/get-shortened-url';
import { UpdateShortenedUrlController } from './updated-shortened-url.controller';
import { UpdateShortenedUrlUseCase } from '@/domain/shortener/use-cases/update-shortened-url';
import { DeleteShortenedUrlController } from './delete-shortened-url.controller';
import { DeleteShortenedUrlUseCase } from '@/domain/shortener/use-cases/delete-shortened-url';

@Module({
  controllers: [
    CreateShortenedUrlController,
    GetUrlController,
    UpdateShortenedUrlController,
    DeleteShortenedUrlController
  ],
  providers: [
    CreateShortenedUrlUseCase,
    GenerateUniqueShortCodeService,
    GetShortenedUrlUseCase,
    UpdateShortenedUrlUseCase,
    DeleteShortenedUrlUseCase
  ],
})
export class ShortedModule {}
