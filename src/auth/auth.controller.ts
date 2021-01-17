import { Post, Body, Controller, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthCredentialsDto } from './dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.login(authCredentialsDto);

    return { accessToken };
  }
}
