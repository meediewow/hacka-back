import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { UserService } from '../user/services/user.service';
import { AlsService } from '../../als/als.service';

import { AddReviewRequestDto } from './dto/review.dto';
import { ReviewEntity } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  @InjectRepository(ReviewEntity)
  private readonly reviewsRepository!: MongoRepository<ReviewEntity>;

  @Inject(AlsService)
  private readonly alsService: AlsService;

  @Inject(UserService)
  private userService: UserService;

  public async addReview(data: AddReviewRequestDto) {
    const target = this.userService.findUser({
      id: data.target
    });

    if (!target) {
      throw new BadRequestException('User is not found');
    }

    const initiator = this.alsService.getStore().user;

    const review = new ReviewEntity();

    review.text = data.text;
    review.rate = data.rate;
    review.target = data.target;
    review.date = new Date().toISOString();
    review.name = initiator.profile?.name ?? '';
    review.photo = initiator.profile?.photo ?? '';

    await this.reviewsRepository.save(review);
    await this.userService.updateUserRating(data.target, data.rate);
  }

  public async getUserReviews(userId: string) {
    const target = ObjectId.createFromHexString(userId);
    return this.reviewsRepository.find({ where: { target } });
  }
}
