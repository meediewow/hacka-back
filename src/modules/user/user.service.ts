import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { encryptPassword } from '../../crypto';
import { PetService } from '../pet/pet.service';

import { UserEntity } from './entities';
import { IFindUserData } from './types/common.types';
import { ITokenContainer } from './types/token.types';
import { IUserAuthData, UserRole } from './types/user.types';
import { createTokenForUser } from './decorators/auth/utils';
import { RegisterRequestDto } from './dto';

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private userRepository!: MongoRepository<UserEntity>;

  @Inject(PetService)
  private petService!: PetService;

  public async authUser(data: IUserAuthData): Promise<ITokenContainer> {
    const user = await this.findUser({ identifier: data.identifier });

    if (!user) {
      throw new BadRequestException('User is not exists');
    }

    const passwordHash = encryptPassword(data.password);

    if (user.password !== passwordHash) {
      throw new BadRequestException('Incorrect login/password');
    }

    const token = createTokenForUser(user);

    return { token };
  }

  public async createUser(data: RegisterRequestDto) {
    const isExists = await this.isUserExists({ identifier: data.identifier });

    if (isExists) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = encryptPassword(data.password);

    const userEntity = new UserEntity();
    userEntity.identifier = data.identifier;
    userEntity.roles = [UserRole.Client];
    userEntity.password = passwordHash;

    const savedUser = await this.userRepository.save(userEntity);

    await this.petService.addPets(data.data.pets, savedUser);

    return this.authUser({
      password: data.password,
      identifier: data.identifier
    });
  }

  private async findUser({ id, identifier }: IFindUserData) {
    return await this.userRepository.findOne({
      where: {
        identifier,
        id
      }
    });
  }

  private async isUserExists(data: IFindUserData) {
    const user = await this.findUser(data);
    return !!user;
  }
}
