import { User } from '@/domain/users/entities/user';
import { IUserRepository } from '@/domain/users/repositories/user-repository.interface';

export class InMemoryUserRepository implements IUserRepository {
  public items: User[] = [];
  private deletedUsers: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toValue() === id);
    return Promise.resolve(user || null);
  }

  async findByEmail(
    email: string,
    includeDeleted: boolean = false,
  ): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);

    if (user || !includeDeleted) {
      return Promise.resolve(user || null);
    }

    for (const deletedUser of this.deletedUsers.values()) {
      if (deletedUser.email === email) {
        return Promise.resolve(deletedUser);
      }
    }

    return Promise.resolve(null);
  }

  async findAll(): Promise<User[]> {
    return Promise.resolve(this.items);
  }

  async findAllWithDisabled(): Promise<User[]> {
    return Promise.resolve([...this.items]);
  }

  async updateLastLogin(userId: string): Promise<void> {
    const itemIndex = await Promise.resolve(
      this.items.findIndex((item) => item.id.toValue() === userId),
    );

    if (itemIndex >= 0) {
      this.items[itemIndex].lastLoginAt = new Date();
    }
  }

  async create(user: User): Promise<User> {
    this.items.push(user);
    return Promise.resolve(user);
  }

  async save(user: User): Promise<void> {
    const itemIndex = await Promise.resolve(
      this.items.findIndex((item) => item.id.toValue() === user.id.toValue()),
    );

    if (itemIndex >= 0) {
      this.items[itemIndex] = user;
    }
  }

  async delete(id: string): Promise<void> {
    const itemIndex = await Promise.resolve(
      this.items.findIndex((item) => item.id.toValue() === id),
    );

    if (itemIndex >= 0) {
      const deletedUser = this.items[itemIndex];
      this.deletedUsers.set(id, deletedUser);

      this.items.splice(itemIndex, 1);
    }
  }
}
