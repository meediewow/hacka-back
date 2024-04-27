import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { AlsModule } from '../../als/als.module';

import { ReviewsService } from './reviews.service';
import { ReviewEntity } from './entities/review.entity';
import { ReviewsController } from './reviews.controller';

@Module({
  providers: [ReviewsService],
  exports: [ReviewsService],
  controllers: [ReviewsController],
  imports: [AlsModule, UserModule, TypeOrmModule.forFeature([ReviewEntity])]
})
export class ReviewsModule {}
