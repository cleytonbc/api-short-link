import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../dtos/create-user-dto';
import { User } from '../entities/user';
import { IUserRepository } from '../repositories/user-repository.interface';
import { validateEmail } from '../helpers/valid-email';
import { InvalidEmailError } from '../errors/invalid-email-error';
import { EmailAlreadyExistsError } from '../errors/email-already-exists-error';
import { hashPassword } from '../helpers/password-hasher';

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, name, password }: CreateUserDTO): Promise<User> {
    const emailIsValid = validateEmail(email);

    if (!emailIsValid) {
      throw new InvalidEmailError();
    }

    const userAlreadyExists = await this.userRepository.findByEmail(
      email,
      true,
    );

    if (userAlreadyExists) {
      throw new EmailAlreadyExistsError();
    }

    const passwordHash = await hashPassword(password);

    const newUser = User.create({
      name,
      email,
      password: passwordHash,
    });

    const userCreated = await this.userRepository.create(newUser);

    return userCreated;
  }
}
