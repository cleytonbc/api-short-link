import { SWAGGER_API_TAGS } from '@/infra/swagger/tags';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Checar se a api está online',
    tags: [SWAGGER_API_TAGS.HEALTH],
  })
  @ApiOkResponse({
    description: 'A API está online',
    schema: {
      example: {
        status: 'ok',
      },
    },
  })
  check() {
    return { status: 'ok' };
  }
}
