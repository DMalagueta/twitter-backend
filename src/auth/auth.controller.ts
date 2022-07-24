import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

class LoginRequestBody {
  @ApiProperty() email: string;
  @ApiProperty() password: string;
}
class LoginResponseBody {
  @ApiProperty() token: string;
  constructor(token: string) {
    this.token = token;
  }
}
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ type: LoginResponseBody })
  @Post('/login')
  async login(@Req() req) {
    const { username, password } = req.body;
    const session = await this.authService.createNewSession(username, password);
    const user = await this.authService.getUserFromSessionToken(session.id);
    return {
      token: session.id,
      user: user,
    };
  }

  @Post('/validate')
  async validate(@Req() req) {
    console.log(req.body.token);
    const user = await this.authService.getUserFromSessionToken(req.body.token);
    return user;
  }
}
