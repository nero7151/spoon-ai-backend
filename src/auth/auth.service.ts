import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { UserService } from 'src/user/user.service';
import { AuthLoginRequest } from './dto/auth-login-request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(authRequest: AuthLoginRequest): Promise<User | null> {
    const user: User | null = await this.userService.findOne(
      authRequest.username,
    );

    if (!user) {
      return null;
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      authRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
