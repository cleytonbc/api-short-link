import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export type ICurrentUser = {
  id: string;
  email: string;
  name: string;
};

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ICurrentUser | null => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as ICurrentUser | null;
  },
);
