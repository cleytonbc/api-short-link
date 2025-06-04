import { HttpException, HttpStatus } from '@nestjs/common';

export class UserDoesNotExistError extends HttpException {
  constructor() {
    super('User does not exist.', HttpStatus.NOT_FOUND);
  }
}
