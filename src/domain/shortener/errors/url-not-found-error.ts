import { HttpException, HttpStatus } from '@nestjs/common';

export class UrlNotFoundError extends HttpException {
  constructor() {
    super('Url not found.', HttpStatus.NOT_FOUND);
  }
}
