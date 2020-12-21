import {
  Get,
  Post,
  Body,
  Controller,
  UsePipes,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRO } from './user.interface';
import { CreateUserDto } from './dto';
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

  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body('user') userData: CreateUserDto) {
    const newUser = await this.userService.create(userData);

    return newUser;
  }

  @Post('users/check/mail')
  async checkEmail(@Body('email') email: string): Promise<boolean> {
    const exists = await this.userService.isMailExists(email);
    return !exists;
  }
}
