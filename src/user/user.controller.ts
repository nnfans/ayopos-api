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
import { CreateUserDto, UserData } from './dto';
import { UserRO } from './user.interface';
import { User } from './user.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  getSchemaPath,
  ApiExtraModels,
  ApiHeader,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('User')
@ApiExtraModels(UserData)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Authorization Token',
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        user: {
          $ref: getSchemaPath(UserData),
        },
      },
      required: ['user'],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token unauthorized',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async findMe(@User('id', new ParseIntPipe()) id: number): Promise<UserRO> {
    return await this.userService.findById(id);
  }

  @Post('users')
  @UsePipes(new ValidationPipe())
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        user: {
          $ref: getSchemaPath(UserData),
        },
      },
      required: ['user'],
    },
  })
  async create(@Body() userData: CreateUserDto): Promise<UserRO> {
    const newUser = await this.userService.create(userData);

    return newUser;
  }

  @Post('users/check/mail')
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'mail@example.com',
        },
      },
      required: ['email'],
    },
    description: 'email',
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        allowed: {
          type: 'boolean',
        },
      },
    },
    description: 'Email is allowed for registration',
  })
  async checkEmail(
    @Body('email') email: string,
  ): Promise<{ allowed: boolean }> {
    const exists = await this.userService.isMailExists(email);
    return {
      allowed: !exists,
    };
  }
}
