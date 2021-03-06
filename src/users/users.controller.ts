import {
  Body,
  Delete,
  ForbiddenException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { User } from 'src/auth/auth.decorator';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';

class UserUpdateRequestBody {
  password?: string;
  name?: string;
  avatar?: string;
  bio?: string;
}

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/@:username')
  async getUserByUsername(@Param('username') username: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get('/:userid')
  async getUserByUserid(@Param('userid') userid: string): Promise<UserEntity> {
    const user = await this.userService.getUserByUserId(userid);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post('/')
  async createNewUser(@Req() req): Promise<UserEntity> {
    console.log(req.body.username, req.body.password);
    const user = await this.userService.createUser(req.body, req.body.password);
    return user;
  }

  @Patch('/:userid')
  async updateUserDetails(
    @User() authdUser: UserEntity,
    @Param('userid') userid: string,
    @Body() updateUserRequest: UserUpdateRequestBody,
  ): Promise<UserEntity> {
    if (authdUser.id !== userid) {
      throw new ForbiddenException('You can only update your own user details');
    }
    const user = await this.userService.updateUser(userid, updateUserRequest);
    return user;
  }

  @Put('/:userid/follow')
  async followUser(
    @User() follower: UserEntity,
    @Param('userid') followeeId: string,
  ): Promise<UserEntity> {
    const followedUser = await this.userService.createUserFollowRelation(
      follower,
      followeeId,
    );
    return followedUser;
  }

  @Delete('/:userid/follow')
  async unfollowUser(
    @User() follower: UserEntity,
    @Param('userid') followeeId: string,
  ): Promise<UserEntity> {
    const unfollowedUser = await this.userService.deleteUserFollowRelation(
      follower,
      followeeId,
    );
    return unfollowedUser;
  }

  @Get('/:userid/followers')
  async getFollowersOfUser(): Promise<UserEntity[]> {
    return [];
  }

  @Put('/:userid/followees')
  async getFolloweesOfUser(): Promise<UserEntity[]> {
    return [];
  }
}
