import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(
    err: { message?: string },
    user: { id: string; email: string; name: string } | null,
    info: { message?: string },
  ): any {
    if (info instanceof Error && info.message === 'No auth token') {
      return null;
    } else if (info instanceof Error || err) {
      const message = info?.message ?? err?.message;
      throw new HttpException(
        message ?? 'Invalid or expired token.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
