import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  Patch,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';

export class UserCreateRequestBody {
  @ApiProperty() username: string;
  @ApiProperty() password: string;
  @ApiPropertyOptional() name?: string;
  @ApiPropertyOptional() avatar?: string;
  @ApiPropertyOptional() bio?: string;
}

export class UserUpdateRequestBody {
  @ApiProperty() password: string;
  @ApiPropertyOptional() name?: string;
  @ApiPropertyOptional() avatar?: string;
  @ApiPropertyOptional() bio?: string;
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/@:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<UserEntity> {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return user;
  }

  @Get('/:userid')
  async getUserByUserid(@Param('userid') userid: string): Promise<UserEntity> {
    const user = await this.userService.getUserById(userid);
    if (!user) {
      throw new NotFoundException(`User ${userid} not found`);
    }
    return user;
  }

  @Get('/:userid/followers')
  getFollowersOfUser(@Param() param): string {
    return `followers of ${param.userid}`;
  }

  @Post('/')
  async createUser(
    @Body() createUserRequest: UserCreateRequestBody,
  ): Promise<UserEntity> {
    const user = await this.userService.createUser(createUserRequest);
    return user;
  }

  @Patch('/:userid')
  async updateUserDetails(
    @Param('userid') userid: string,
    @Body() updateUserRequest: UserUpdateRequestBody,
  ): Promise<UserEntity> {
    const user = await this.userService.updateUser(userid, updateUserRequest);
    return user;
  }

  @Post('/signin')
  userSignin(@Req() req) {
    const { email, password } = req.body;
    if (email == 'matateu' && password == 1234) {
      return {
        user: { id: 3, name: 'matateu', email: 'matateu@example.com' },
        token: '123456789',
      };
    }
    return 'yes';
  }
}
