import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

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
    const target = await this.userService.findUser({
      id: data.targetId
    });

    if (!target) {
      throw new NotFoundException('User is not found');
    }

    const initiator = this.alsService.getStore().user;

    const review = new ReviewEntity({
      rate: data.rate,
      text: data.text,
      creatorId: initiator._id,
      recipientId: target._id
    });

    review.text = data.text;
    review.rate = data.rate;
    review.recipientId = target._id;

    await this.reviewsRepository.save(review);
  }

  public async getUserReviews(userId: string) {
    const target = ObjectId.createFromHexString(userId);
    return this.reviewsRepository.find({ where: { recipientId: target.id } });
  }
}
