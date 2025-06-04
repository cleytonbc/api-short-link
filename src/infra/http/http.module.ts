import { Module } from '@nestjs/common';
import { UserModule } from './controllers/users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ShortedModule } from './controllers/shorteded/shorteded.module';

@Module({
  imports: [AuthModule, UserModule, ShortedModule],
  controllers: [],
  providers: [],
})
export class HttpModule {}
