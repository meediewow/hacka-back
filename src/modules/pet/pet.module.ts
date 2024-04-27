import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PetService } from './pet.service';
import { PetEntity } from './entities/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PetEntity])],
  providers: [PetService],
  exports: [PetService]
})
export class PetModule {}
