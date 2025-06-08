import './infra/telemetry/telemetry';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './infra/swagger/swagger.config';
import { AllExceptionsFilter } from './infra/http/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
