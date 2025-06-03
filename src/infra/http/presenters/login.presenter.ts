import { AuthResponseDTO } from '@/infra/auth/dtos/auth-response.dto';

export class LoginPresenter {
  static toHTTP(login: AuthResponseDTO) {
    return {
      access_token: login.access_token,
      user: {
        id: login.user.id,
        email: login.user.email,
        name: login.user.name,
      },
    };
  }
}
