import { IsNotEmpty } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
