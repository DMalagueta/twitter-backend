import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  /* FIND USER BY NAME */
  public async getUserByUsername(username: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ where: { username } });
  }

  /* FIND USER BY ID */
  public async getUserById(userId: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ where: { id: userId } });
  }

  /* CREATE USER */
  public async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
    return await this.usersRepository.save(user);
  }
}
