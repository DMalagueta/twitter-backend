import { Controller, Get, Post, Param, Req, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get('/@:username')
  getUserByUsername(@Param('username') username: string): string {
    return `${username}`;
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
