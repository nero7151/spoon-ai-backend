import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateReviewDto, @Request() req) {
    const user = req.user;
    const review = await this.reviewService.createReview(dto as any, user.id);
    return review;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
    @Request() req,
  ) {
    const user = req.user;
    const review = await this.reviewService.updateReview(
      parseInt(id),
      dto as any,
      user.id,
    );
    return review;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const user = req.user;
    const result = await this.reviewService.deleteReview(parseInt(id), user.id);
    return result;
  }
}
