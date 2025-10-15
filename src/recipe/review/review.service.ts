import { Injectable, BadRequestException } from '@nestjs/common';
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
}
