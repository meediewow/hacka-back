import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';

import { ReviewsService } from './reviews.service';
import { ReviewEntity } from './entities/review.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewSeed } from './seeds/review.seed';

@Module({
  providers: [ReviewsService, ReviewSeed],
  exports: [ReviewsService],
  controllers: [ReviewsController],
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([ReviewEntity])
  ]
})
export class ReviewsModule {}
