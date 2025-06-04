import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { IUserRepository } from '@/domain/users/repositories/user-repository.interface';
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository';
import { PrismaShortenedRepository } from './prisma/repositories/prisma-shortened-url-repository';
import { IShortenedUrlRepository } from '@/domain/shortener/repositories/shortened-url-repository.interface';

@Global()
@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: IShortenedUrlRepository,
      useClass: PrismaShortenedRepository,
    },

  ],
  exports: [
    PrismaService,
    IUserRepository,
    IShortenedUrlRepository,

  ],
})
export class DatabaseModule {}
