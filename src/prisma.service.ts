import { Injectable, OnModuleInit } from '@nestjs/common';
import { prismaConfig } from './prisma.config';

/**
 * Dynamically require the generated Prisma client at runtime.
 * This handles different layouts depending on whether the app runs from
 * source (dev, host-mounted) or from compiled `dist` (prod image).
 */
let PrismaClientCtor: any;
try {
  // When running from compiled code (dist/src), the generated client is expected
  // at dist/generated/prisma -> require('../generated/prisma') from dist/src
  PrismaClientCtor = require('../generated/prisma').PrismaClient;
} catch (e1) {
  try {
    // When running from source (ts-node / dev) the generated client is at generated/prisma
    PrismaClientCtor = require('../../generated/prisma').PrismaClient;
  } catch (e2) {
    // Fallback to node resolution (may work if package.json/prisma config points to it)
    PrismaClientCtor = require('generated/prisma').PrismaClient;
  }
}

@Injectable()
export class PrismaService
  extends (PrismaClientCtor as any)
  implements OnModuleInit
{
  constructor() {
    // Pass prismaConfig into the generated client constructor
    super(prismaConfig);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
