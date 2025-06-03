import { IUserRepository } from '@/domain/users/repositories/user-repository.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ICurrentUser } from '../decorators/current-user.decorator';
import { EnvService } from '@/infra/env/env.service';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: IUserRepository,
    env: EnvService,
  ) {
    const secret = env.get('JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
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
