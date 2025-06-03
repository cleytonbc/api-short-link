import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IUserRepository } from '@/domain/users/repositories/user-repository.interface';
import { User } from '@/domain/users/entities/user';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        OR: [{ deletedAt: null }, { deletedAt: { not: null } }],
      },
    });
    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  findAllWithDisabled(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => PrismaUserMapper.toDomain(u));
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  async create(user: User): Promise<User> {
    const data = PrismaUserMapper.toPrisma(user);
    const createdUser = await this.prisma.user.create({
      data,
    });

    return PrismaUserMapper.toDomain(createdUser);
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
