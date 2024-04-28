import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { UserRepository } from '../user.repository';
import { UserEntity } from '../entities';
import { UserRole } from '../types/user.types';
import { PetType } from '../../pet/enum/pet-type.enum';

@Injectable()
export class UserSeed implements OnApplicationBootstrap {
  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  onApplicationBootstrap() {
    if (this.userRepository) {
      return;
    }
    Object.keys(UserRole).forEach(async (role) => {
      await this.seed(UserRole[role], 10);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
  }

  async seed(role: UserRole, count: number) {
    const user: Partial<UserEntity> = {
      roles: [role],
      rate: 0,
      password: faker.internet.password(),
      identifier: faker.internet.email(),
      about: faker.lorem.sentence(),
      location: {
        type: 'Point',
        coordinates: faker.location.nearbyGPSCoordinate({
          origin: [faker.location.longitude(), faker.location.latitude()]
        })
      },
      profile: {
        name: faker.person.fullName(),
        address: {
          city: faker.location.city(),
          country: faker.location.country()
        },
        tariff: Object.keys(PetType).map((key) => ({
          category: PetType[key] as PetType,
          pricePerDay: faker.number.int()
        })),
        communication: {
          phone: faker.phone.number()
        }
      }
    };

    const data = Array.from({ length: count }, () => user);
    await this.userRepository.insertMany(data);
  }
}
