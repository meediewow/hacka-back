import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { DevModule } from '../dev/dev.module';
import { TypeOrmModule } from '../db/db.module';
import { UserModule } from '../user/user.module';
import { AlsModule } from '../../als/als.module';
import { UserService } from '../user/services/user.service';
import { UploadModule } from '../upload/upload.module';
import { PetModule } from '../pet/pet.module';
import { SessionModule } from '../session/session.module';
import { TariffsModule } from '../tariffs/tariffs.module';
import { userExtractor } from '../user/utils/userExtractor.utils';
import { OrderModule } from '../order/order.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { AlsService } from '../../als/als.service';

@Module({
  imports: [
    AlsModule,
    DevModule,
    UserModule,
    UploadModule,
    SessionModule,
    TypeOrmModule,
    PetModule,
    TariffsModule,
    OrderModule,
    ReviewsModule
  ],
  providers: [],
  controllers: []
})
export class AppModule implements NestModule {
  constructor(
    private readonly als: AlsService,
    private readonly userService: UserService
  ) {}

  configure(consumer: MiddlewareConsumer) {
    userExtractor(this.als, this.userService, consumer);
  }
}
