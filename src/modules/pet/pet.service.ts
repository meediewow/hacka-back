import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Inject } from '@nestjs/common';

import { UserEntity } from '../user/entities';
import { AlsService } from '../../als/als.service';

import { PetData, PetEntity } from './entities/pet.entity';
import { PetResponseDto } from './dto/pet.dto';

export class PetService {
  @InjectRepository(PetEntity)
  private petRepository: MongoRepository<PetEntity>;

  @Inject(AlsService)
  private readonly userAls: AlsService;

  async addPets(
    pets: Omit<PetData, 'userId'>[],
    userEntity?: UserEntity
  ): Promise<PetResponseDto[]> {
    const user = userEntity ?? this.userAls.getStore().user;
    await this.petRepository.save(
      pets.map(
        (i) =>
          new PetEntity({
            ...i,
            userId: user._id
          })
      )
    );
    return this.getPets(user);
  }

  getPets(userEntity: UserEntity): Promise<PetResponseDto[]> {
    return this.petRepository.find({
      where: {
        userId: userEntity._id
      }
    });
  }

  getPetsByIds(ids: PetEntity['_id'][]): Promise<PetEntity[]> {
    return this.petRepository.find({
      where: {
        _id: {
          $in: ids
        }
      }
    });
  }
}
