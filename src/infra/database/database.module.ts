import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { IUserRepository } from '@/domain/users/repositories/user-repository.interface';
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository';
import { PrismaShortenedRepository } from './prisma/repositories/prisma-shortened-url-repository';
import { IShortenedUrlRepository } from '@/domain/shortener/repositories/shortened-url-repository.interface';
import { IUrlClickRepository } from '@/domain/shortener/repositories/url-click-repository.interface';
import { PrismaUrlClickRepository } from './prisma/repositories/prisma-url-click-repository';
import { IVwUrlClicksSummaryRepository } from '@/domain/shortener/repositories/vw-url-click-summary.interface';
import { PrismaVwUrlClicksSummaryRepository } from './prisma/repositories/prisma-vw-url-click-summary-repository';

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
    {
      provide: IUrlClickRepository,
      useClass: PrismaUrlClickRepository,
    },
    {
      provide: IVwUrlClicksSummaryRepository,
      useClass: PrismaVwUrlClicksSummaryRepository,
    },
  ],
  exports: [
    PrismaService,
    IUserRepository,
    IShortenedUrlRepository,
    IVwUrlClicksSummaryRepository,
    IUrlClickRepository,
  ],
})
export class DatabaseModule {}
