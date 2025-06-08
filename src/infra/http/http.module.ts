import { Module } from '@nestjs/common';
import { UserModule } from './controllers/users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ShortedModule } from './controllers/shorteded/shorteded.module';
import { HealthModule } from './controllers/health/health.module';

@Module({
  imports: [HealthModule, AuthModule, UserModule, ShortedModule],
  controllers: [],
  providers: [],
})
export class HttpModule {}
