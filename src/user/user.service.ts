import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';
import { UserCreate } from './dto/user-create.dto';
import * as bcrypt from 'bcrypt';
import { securityConstants } from 'src/auth/constants';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { id: id },
    });
  }

  /**
   * Find user for authentication with plain password comparison
   * Returns user without password if authentication succeeds
   */
  async findAuthUser(username: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      omit: { password: false },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return Object.assign({}, user, { password: undefined }) as User;
    }

    return null;
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const existingUser = await this.findOne(id);

    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.user.update({
      where: { id },
      data: user,
    });
  }

  async remove(id: number) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // Delete the user. Cascade behavior depends on DB schema/migrations.
    await this.prisma.user.delete({ where: { id } });
    return { deleted: true };
  }

  async register(userCreate: UserCreate): Promise<User> {
    const hashedPassword: string = await bcrypt.hash(
      userCreate.password,
      securityConstants.bcryptSaltRounds,
    );
    return await this.prisma.user.create({
      data: {
        username: userCreate.username,
        password: hashedPassword,
        email: userCreate.email,
      },
    });
  }

  async getRecipes(userId: number) {
    return this.prisma.recipe.findMany({
      where: { user_id: userId },
      include: { requirement: true, _count: { select: { reviews: true } } },
      orderBy: { created_at: 'desc' },
    });
  }
}
