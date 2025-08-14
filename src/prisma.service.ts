import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { prismaConfig } from './prisma.config';

@Injectable()
/**
 * PrismaService is a service that extends PrismaClient to manage database connections.
 * @see https://docs.nestjs.com/recipes/prisma
 */
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super(prismaConfig);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
