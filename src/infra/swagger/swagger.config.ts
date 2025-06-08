import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { patchNestJsSwagger } from 'nestjs-zod';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const setupSwagger = (app: INestApplication) => {
  patchNestJsSwagger();
  const config = new DocumentBuilder()
    .setTitle('API Short Link')
    .setDescription(
      'API para transformar URLs longas em versões curtas e fáceis de compartilhar.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearerAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const publicEndpoints = [
    { path: '/{code}', method: 'get' },
    { path: '/auth/login', method: 'post' },
    { path: '/health', method: 'get' },
  ];

  if (document.paths) {
    Object.entries(document.paths).forEach(([pathKey, path]) => {
      Object.entries(path).forEach(
        ([methodKey, method]: [string, OperationObject]) => {
          const isPublic = publicEndpoints.some(
            (endpoint) =>
              endpoint.path === pathKey &&
              endpoint.method === methodKey.toLowerCase(),
          );

          if (!isPublic && !method.security) {
            method.security = [{ bearerAuth: [] }];
          }
        },
      );
    });
  }

  SwaggerModule.setup('/docs', app, document);
};
