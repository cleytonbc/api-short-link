import './infra/telemetry/telemetry';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './infra/swagger/swagger.config';
import { AllExceptionsFilter } from './infra/http/filters/all-exceptions.filter';
import { EnvService } from './infra/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvService);

  app.useGlobalFilters(new AllExceptionsFilter());

  setupSwagger(app);

  const port = configService.get('PORT');

  await app.listen(port ?? 3000);
}
bootstrap();
