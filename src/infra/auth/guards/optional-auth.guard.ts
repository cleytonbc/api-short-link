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
    err: any,
    user: { id: string; email: string; name: string } | null,
    info: any,
    context: any,
    status: any,
  ): any {
    if (info instanceof Error && info.message === 'No auth token') {
      return null;
    } else if (info instanceof Error || err) {
      const message = (info?.message as string) ?? (err?.message as string);
      throw new HttpException(
        message ?? 'Invalid or expired token.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
