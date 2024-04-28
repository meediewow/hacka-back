import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable
} from '@nestjs/common';

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

  @Inject(forwardRef(() => UserService))
  private userService: UserService;

  getUserRate(targetId: ReviewEntity['targetId']) {
    return this.reviewsRepository
      .aggregate([
        {
          $match: {
            targetId
          }
        },
        {
          $group: {
            _id: '$targetId',
            rate: {
              $avg: '$rate'
            }
          }
        }
      ])
      .next();
  }

  public async addReview(data: AddReviewRequestDto) {
    const target = await this.userService.findUser({
      id: data.targetId
    });

    if (!target) {
      throw new BadRequestException('User is not found');
    }

    const initiator = this.alsService.getStore().user;

    if (target._id.equals(initiator._id)) {
      throw new BadRequestException('You cannot leave a review for yourself');
    }

    const review = new ReviewEntity({
      rate: data.rate,
      text: data.text,
      targetId: target._id,
      authorId: initiator._id
    });

    await this.reviewsRepository.save(review);
  }

  public async getUserReviews(userId: string) {
    const target = ObjectId.createFromHexString(userId);
    return this.reviewsRepository.find({ where: { target } });
  }
}
