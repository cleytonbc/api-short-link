import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDTO } from './dtos/auth-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { IUserRepository } from '@/domain/users/repositories/user-repository.interface';
import { comparePassword } from '@/domain/users/helpers/password-hasher';
import { User } from '@/domain/users/entities/user';

interface IValidateUserResponse {
  id: string;
  email: string;
  name: string;
}
@Injectable()
export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<IValidateUserResponse | null> {
    const user = await this.userRepository.findByEmail(email, false);

    if (!user || user.deletedAt) {
      return null;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    await this.userRepository.updateLastLogin(user.id.toString());

    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
    };
  }

  async login(user: User): Promise<AuthResponseDTO> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id.toString(),
    };

    return Promise.resolve({
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  }
}
