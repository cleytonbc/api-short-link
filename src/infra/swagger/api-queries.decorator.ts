import { applyDecorators } from '@nestjs/common';
import type { ApiQueryOptions } from '@nestjs/swagger';
import { ApiQuery } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';

import { ZodRawShape, z } from 'zod';

export const ApiQueries = <T extends z.ZodObject<ZodRawShape>>(
  zodObject: T,
) => {
  const optionsList = Object.keys(zodObject.shape).reduce<
    Array<ApiQueryOptions & { schema: ReturnType<typeof zodToOpenAPI> }>
  >((acc, name) => {
    const zodType = zodObject.shape[name];
    const schema = zodToOpenAPI(zodType);

    if (zodType)
      acc.push({
        name,
        required: !zodType.isOptional(),
        description: schema.description as string,
        schema,
      });

    return acc;
  }, []);

  return applyDecorators(...optionsList.map((options) => ApiQuery(options)));
};
