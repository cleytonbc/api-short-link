import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface IClientInfo {
  ipAddress: string;
  userAgent: string | null;
}

export const ClientInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IClientInfo => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const getClientIp = (): string => {
      const forwarded = request.headers['x-forwarded-for'];
      const realIp = request.headers['x-real-ip'];
      const cfConnectingIp = request.headers['cf-connecting-ip'];

      if (cfConnectingIp) return cfConnectingIp as string;
      if (realIp) return realIp as string;
      if (forwarded) {
        return (forwarded as string).split(',')[0].trim();
      }

      return request.ip || request.socket?.remoteAddress || 'unknown';
    };

    return {
      ipAddress: getClientIp(),
      userAgent: request.headers['user-agent'] || null,
    };
  },
);
