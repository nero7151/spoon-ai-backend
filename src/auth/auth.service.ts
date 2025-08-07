import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { UserService } from 'src/user/user.service';
import { AuthLoginRequest } from './dto/auth-login-request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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

  login(user: User): { access_token: string } {
    // Logic to generate JWT token or session
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    };
  }
}
