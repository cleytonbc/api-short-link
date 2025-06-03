import { ICurrentUser } from '@/infra/auth/decorators/current-user.decorator';

declare namespace Express {
  interface Request {
    user: ICurrentUser | null;
  }
}
