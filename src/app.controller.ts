import { Get, Controller } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root(): string {
    return '200: OK';
  }
}
