import {
  Inject,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap
} from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from '../../user/user.repository';
import { UserRole } from '../../user/types/user.types';
import { ReviewEntity } from '../entities/review.entity';

@Injectable()
export class ReviewSeed implements OnApplicationBootstrap {
  @InjectRepository(ReviewEntity)
  private readonly reviewRepository: UserRepository;

  @Inject(UserRepository)
  private userRepository: UserRepository;

  async onApplicationBootstrap(): Promise<void> {
    // await this.seed();
  }

  async seed(): Promise<void> {
    const client = await this.userRepository
      .aggregate([
        {
          $match: {
            roles: { $in: [UserRole.Client] }
          }
        },
        { $sample: { size: 1 } }
      ])
      .next();

    if (!client) {
      throw new NotFoundException();
    }

    const sitters = await this.userRepository
      .aggregate([
        {
          $match: {
            roles: { $in: [UserRole.Sitter] }
          }
        },
        { $sample: { size: 100 } }
      ])
      .toArray();

    let result: Partial<ReviewEntity>[] = [];

    for (const sitter of sitters) {
      const getReview: () => Partial<ReviewEntity> = () => ({
        text: faker.lorem.sentence(),
        rate: faker.number.int({ min: 1, max: 5 }),
        authorId: client._id,
        targetId: sitter._id
      });

      const data = Array.from(
        { length: faker.number.int({ min: 1, max: 4 }) },
        getReview
      );
      result = result.concat(data);
    }

    await this.reviewRepository.save(result);
  }
}
