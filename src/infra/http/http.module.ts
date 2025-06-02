import { Module } from '@nestjs/common';
import { UserModule } from './controllers/users/users.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class HttpModule {}
