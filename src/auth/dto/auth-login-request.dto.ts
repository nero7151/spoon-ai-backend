import { IsString } from 'class-validator';

export class AuthLoginRequest {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
