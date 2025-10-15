import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}
