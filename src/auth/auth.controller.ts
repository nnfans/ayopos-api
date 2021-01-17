import {
  Post,
  Body,
  Controller,
  UsePipes,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.login(authCredentialsDto);

    return { accessToken };
  }
}
