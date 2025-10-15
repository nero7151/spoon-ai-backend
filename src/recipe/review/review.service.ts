import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async createReview(
    data: { recipe_id: number; content: string; rating: number },
    userId: number,
  ) {
    const { recipe_id, content, rating } = data;

    if (!content || !content.trim()) {
      throw new BadRequestException('Review content is required');
    }

    const review = await this.prisma.review.create({
      data: {
        content,
        rating,
        recipe: { connect: { id: recipe_id } },
        user: { connect: { id: userId } },
      },
    });

    return review;
  }

  async updateReview(
    reviewId: number,
    data: { content?: string; rating?: number },
    userId: number,
  ) {
    const existing = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, user_id: true },
    });

    if (!existing) {
      throw new NotFoundException('Review not found');
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenException('Not allowed to edit this review');
    }

    if (data.content && !data.content.trim()) {
      throw new BadRequestException('Review content is required');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        content: data.content,
        rating: data.rating,
      },
    });

    return updated;
  }

  async deleteReview(reviewId: number, userId: number) {
    const existing = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, user_id: true },
    });

    if (!existing) {
      throw new NotFoundException('Review not found');
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenException('Not allowed to delete this review');
    }

    await this.prisma.review.delete({ where: { id: reviewId } });

    return { deleted: true };
  }
}
