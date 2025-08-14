import { Prisma } from 'generated/prisma';

/**
 * Configuration for global omit functionality
 * Add models and fields you want to omit globally
 */
export const prismaConfig: Prisma.PrismaClientOptions = {
  omit: {
    user: {
      password: true,
      // Add other sensitive fields here if needed
    },
    // Add other models here if needed
    // recipe: {
    //   someInternalField: true,
    // },
  },
};
