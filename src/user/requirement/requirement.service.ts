import { Injectable } from '@nestjs/common';
import { Requirement, Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RequirementService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(where: Prisma.RequirementWhereInput): Promise<Requirement[]> {
    return await this.prisma.requirement.findMany({
      where,
    });
  }

  async findOne(
    where: Prisma.RequirementWhereUniqueInput,
  ): Promise<Requirement | null> {
    return await this.prisma.requirement.findUnique({
      where,
    });
  }

  async create(
    data: Prisma.RequirementUncheckedCreateInput,
  ): Promise<Requirement> {
    return await this.prisma.requirement.create({
      data,
    });
  }
}
