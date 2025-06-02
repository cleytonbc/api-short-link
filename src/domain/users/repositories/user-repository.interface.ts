import { User } from '../entities/user';

export abstract class IUserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(
    email: string,
    includeDeleted?: boolean,
  ): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract create(user: User): Promise<User>;
  abstract save(user: User): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
