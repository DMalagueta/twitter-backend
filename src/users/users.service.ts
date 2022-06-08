import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { PasswordEntity } from 'src/auth/passwords.entity';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private authService: AuthService,
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
  public async createUser(
    user: Partial<UserEntity>,
    password: string,
  ): Promise<UserEntity> {
    const newUser = await this.usersRepository.save(user);

    await this.authService.createPasswordForNewUser(newUser.id, password);

    return newUser;
  }

  /* UPDATE USER */
  public async updateUser(
    userId: string,
    newUserDetails: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const existingUser = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!existingUser) {
      return null;
    }
    if (newUserDetails.bio) existingUser.bio = newUserDetails.bio;
    if (newUserDetails.avatar) existingUser.avatar = newUserDetails.avatar;
    if (newUserDetails.name) existingUser.name = newUserDetails.name;

    return await this.usersRepository.save(existingUser);
  }
}
