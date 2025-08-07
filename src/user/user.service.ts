import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';
import { UserCreate } from './dto/user-create.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username: username },
    });
  }

  async register(userCreate: UserCreate): Promise<User> {
    const hashedPassword: string = await bcrypt.hash(userCreate.password, 10);
    return this.prisma.user.create({
      data: {
        username: userCreate.username,
        password: hashedPassword,
        email: userCreate.email,
      },
    });
  }
}
