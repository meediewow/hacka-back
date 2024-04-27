import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { AlsModule } from '../../als/als.module';
import { UserService } from '../user/user.service';

import { ReviewsService } from './reviews.service';
import { ReviewEntity } from './entities/review.entity';
import { ReviewsController } from './reviews.controller';

const EntitiesModule = TypeOrmModule.forFeature([ReviewEntity]);

@Module({
  providers: [ReviewsService, UserService],
  exports: [ReviewsService, EntitiesModule],
  controllers: [ReviewsController],
  imports: [AlsModule, UserModule, EntitiesModule]
})
export class ReviewsModule {}
