import { Body, Controller, Get, Param } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GuardPost } from '../user/decorators';
import { UserRole } from '../user/types/user.types';
import { SuccessDto } from '../../network/dto/success.dto';

import { ReviewsService } from './reviews.service';
import { AddReviewRequestDto, ReviewsResponseDto } from './dto/review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @GuardPost([UserRole.Client, UserRole.Sitter], 'add')
  @ApiResponse({ type: SuccessDto })
  @ApiBody({ type: AddReviewRequestDto })
  public async addReview(@Body() body: AddReviewRequestDto) {
    await this.reviewsService.addReview(body);
  }

  @Get('list/:targetId')
  @ApiParam({ type: 'string', name: 'targetId', example: 'xxxxxxxxxxxxxxx' })
  @ApiResponse({ type: ReviewsResponseDto })
  public async getReviewsList(@Param() { targetId }: { targetId: string }) {
    const list = await this.reviewsService.getUserReviews(targetId);
    return { list };
  }
}
