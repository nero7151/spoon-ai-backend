import { PrismaClient } from '../generated/prisma';

async function main() {
  const prisma = new PrismaClient();
  try {
    const review = await prisma.review.create({
      data: {
        content: '테스트 자동 삽입 리뷰 - 최고예요',
        rating: 5,
        user_id: 1,
        recipe_id: 9,
      },
    });
    console.log('Created review:', review);
  } catch (err) {
    console.error('Error creating review:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
