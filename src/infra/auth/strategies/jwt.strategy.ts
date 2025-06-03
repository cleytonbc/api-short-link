import { IUserRepository } from '@/domain/users/repositories/user-repository.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ICurrentUser } from '../decorators/current-user.decorator';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: IUserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload): Promise<ICurrentUser> {
    const user = await this.userRepository.findById(payload.sub);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Token inválido');
    }

    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
    };
  }
}
