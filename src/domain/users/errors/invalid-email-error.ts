import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidEmailError extends HttpException {
  constructor() {
    super(`The email is invalid`, HttpStatus.BAD_REQUEST);
  }
}
