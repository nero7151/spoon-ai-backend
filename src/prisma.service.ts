import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
/**
 * PrismaService is a service that extends PrismaClient to manage database connections.
 * @see https://docs.nestjs.com/recipes/prisma
 */
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
