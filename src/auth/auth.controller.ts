import {
  Post,
  Body,
  Controller,
  UsePipes,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(
    @Body('user') authCredentialsDto: AuthCredentialsDto,
    @Res() res: Response
  ) {
    const accessToken = await this.authService.login(authCredentialsDto);

    res.status(HttpStatus.OK).json({ accessToken });
  }
}
