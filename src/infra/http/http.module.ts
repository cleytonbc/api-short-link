import { Module } from '@nestjs/common';
import { UserModule } from './controllers/users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class HttpModule {}
