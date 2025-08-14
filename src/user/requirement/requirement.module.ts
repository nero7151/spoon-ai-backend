import { Module } from '@nestjs/common';
import { RequirementService } from './requirement.service';
import { RequirementController } from './requirement.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [RequirementService, PrismaService],
  controllers: [RequirementController],
  exports: [RequirementService],
})
export class RequirementModule {}
