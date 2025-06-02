import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsError extends HttpException {
  constructor() {
    super('Email address is already in use.', HttpStatus.CONFLICT);
  }
}
