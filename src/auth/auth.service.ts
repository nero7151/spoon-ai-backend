import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { UserService } from 'src/user/user.service';
import { AuthLoginRequest } from './dto/auth-login-request.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(authRequest: AuthLoginRequest): Promise<User | null> {
    return await this.userService.findAuthUser(
      authRequest.username,
      authRequest.password,
    );
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
