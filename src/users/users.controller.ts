import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/@:username')
  async getUserByUsername(@Param('username') username: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return user;
  }

  @Get('/:userid')
  getUserByUserid(@Param('userid') userid: string): string {
    return `${userid}`;
  }

  @Get('/:userid/followers')
  getFollowersOfUser(@Param() param): string {
    return `followers of ${param.userid}`;
  }

  @Post('/')
  createUser(): string {
    return 'create user';
  }

  @Patch('/:userid')
  updateUserDetails(@Param('userid') userid: string): string {
    return `updated ${userid}`;
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
