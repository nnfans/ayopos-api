import {
  Get,
  Post,
  Body,
  Controller,
  UsePipes,
  ParseIntPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';
import { UserRO } from './user.interface';
import { User } from './user.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { AuthGuard } from '../auth/auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  @UseGuards(AuthGuard)
  async findMe(@User('id', new ParseIntPipe()) id: number): Promise<UserRO> {
    return await this.userService.findById(id);
  }

  @Post('users')
  @UsePipes(new ValidationPipe())
  async create(@Body() userData: CreateUserDto): Promise<UserRO> {
    const newUser = await this.userService.create(userData);

    return newUser;
  }

  @Post('users/check/mail')
  @HttpCode(200)
  async checkEmail(
    @Body('email') email: string,
  ): Promise<{ allowed: boolean }> {
    const exists = await this.userService.isMailExists(email);
    return {
      allowed: !exists,
    };
  }
}
