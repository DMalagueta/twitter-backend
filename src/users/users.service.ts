import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { UserFollowingEntity } from './userfollowings.entity';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private authService: AuthService,
    @InjectRepository(UserFollowingEntity)
    private userFollowRepo: Repository<UserFollowingEntity>,
  ) {}

  public async getUserByUsername(username: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { username } });
  }

  public async getUserByUserId(userId: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { id: userId } });
  }

  public async createUser(
    user: Partial<UserEntity>,
    password: string,
  ): Promise<UserEntity> {
    const usernameAlreadyExists = await this.getUserByUsername(user.username);
    if (usernameAlreadyExists)
      throw new ConflictException('This username is already taken!');

    const newUser = await this.userRepo.save(user);

    await this.authService.createPasswordForNewUser(newUser.id, password);

    return newUser;
  }

  public async updateUser(
    userId: string,
    newUserDetails: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const existingUser = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!existingUser) {
      return null;
    }
    if (newUserDetails.bio) existingUser.bio = newUserDetails.bio;
    if (newUserDetails.avatar) existingUser.avatar = newUserDetails.avatar;
    if (newUserDetails.name) existingUser.name = newUserDetails.name;

    return await this.userRepo.save(existingUser);
  }

  public async createUserFollowRelation(
    follower: UserEntity,
    followeeId: string,
  ) {
    const followee = await this.getUserByUserId(followeeId);
    if (!followee) {
      throw new NotFoundException('User not found');
    }
    const newFollow = await this.userFollowRepo.save({
      follower,
      followee,
    });
    return newFollow.followee;
  }

  public async deleteUserFollowRelation(
    follower: UserEntity,
    followeeId: string,
  ) {
    const followee = await this.getUserByUserId(followeeId);
    if (!followee) {
      throw new NotFoundException('User not found');
    }
    const follow = await this.userFollowRepo.findOne({
      where: { follower, followee },
    });
    if (follow) {
      await this.userFollowRepo.delete(follow.id);
      return followee;
    } else {
      throw new NotFoundException('No follow relationship found');
    }
  }
}
