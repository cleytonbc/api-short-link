import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface UserProps {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
  deletedAt?: Date | null;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  set name(newName: string) {
    this.props.name = newName;
  }

  get email() {
    return this.props.email;
  }

  set email(newEmail: string) {
    this.props.email = newEmail;
  }

  get password() {
    return this.props.password;
  }

  set password(newPassword: string) {
    this.props.password = newPassword;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set updatedAt(date: Date) {
    this.props.updatedAt = date;
  }

  get lastLoginAt() {
    return this.props.lastLoginAt;
  }

  set lastLoginAt(date: Date | null | undefined) {
    this.props.lastLoginAt = date;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  softDelete() {
    this.props.deletedAt = new Date();
    this.props.updatedAt = new Date();
  }

  restore() {
    this.props.deletedAt = null;
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<
      UserProps,
      'createdAt' | 'updatedAt' | 'lastLoginAt' | 'deletedAt'
    >,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        lastLoginAt: props.lastLoginAt ?? null,
        deletedAt: props.deletedAt ?? null,
      },
      id,
    );

    return user;
  }
}
