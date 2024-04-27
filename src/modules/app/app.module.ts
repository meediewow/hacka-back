import { Module } from '@nestjs/common';

import { DevModule } from '../dev/dev.module';
import { TypeOrmModule } from '../db/db.module';
import { UserModule } from '../user/user.module';
import { AlsModule } from '../../als/als.module';
import { UploadModule } from '../upload/upload.module';
import { PetModule } from '../pet/pet.module';
import { SessionModule } from '../session/session.module';
import { TariffsModule } from '../tariffs/tariffs.module';
import { OrderModule } from '../order/order.module';
import { ReviewsModule } from '../reviews/reviews.module';

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
export class AppModule {}
