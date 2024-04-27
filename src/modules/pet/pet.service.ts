import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { UserEntity } from '../user/entities';

import { PetData, PetEntity } from './entities/pet.entity';
import { PetResponseDto } from './dto/pet.dto';

export class PetService {
  @InjectRepository(PetEntity)
  private petRepository: MongoRepository<PetEntity>;

  addPets(
    pets: Omit<PetData, 'userId'>[],
    userEntity: UserEntity
  ): Promise<PetEntity[]> {
    return this.petRepository.save(
      pets.map(
        (i) =>
          new PetEntity({
            ...i,
            userId: userEntity.id
          })
      )
    );
  }

  getPets(userEntity: UserEntity): Promise<PetResponseDto[]> {
    return this.petRepository.find({
      where: {
        userId: userEntity.id
      }
    });
  }

  async removePet(id: string): Promise<boolean> {
    await this.petRepository.delete(id);
    return true;
  }
}
