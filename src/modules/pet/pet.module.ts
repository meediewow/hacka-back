import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PetService } from './pet.service';
import { PetEntity } from './entities/pet.entity';
import { PetController } from './pet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PetEntity])],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService]
})
export class PetModule {}
