import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'generated/prisma';
import { Requirement } from 'generated/prisma';
import { RequirementCreate } from './dto/requirement-create.dto';
import { RequirementService } from './requirement.service';

@Controller('requirement')
export class RequirementController {
  constructor(private readonly requirementService: RequirementService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req: { user: User }): Promise<Requirement[]> {
    return await this.requirementService.findAll({
      user: { id: req.user.id },
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req: { user: User },
    @Body() requirement: RequirementCreate,
  ): Promise<Requirement> {
    return await this.requirementService.create({
      user_id: req.user.id,
      ...requirement,
    });
  }
}
