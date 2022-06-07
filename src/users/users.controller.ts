import { Controller, Get, Post, Param, Req } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/@:username')
  getUserByUsername(@Param() param): string {
    return `${param.username}`;
  }

  @Get('/:userid')
  getUserByUserid(@Param() param): string {
    return `${param.userid}`;
  }

  @Get('/:userid/followers')
  getFollowersOfUser(@Param() param): string {
    return `followers of ${param.userid}`;
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
