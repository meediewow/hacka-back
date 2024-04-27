import { AsyncLocalStorage } from 'node:async_hooks';

import { ObjectId } from 'mongodb';
import { FindOptionsWhere, MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { encryptPassword } from '../../crypto';
import { PetService } from '../pet/pet.service';

import { UserEntity } from './entities';
import { RegisterRequestDto } from './dto';
import { IFindUserData } from './types/common.types';
import { ITokenContainer } from './types/token.types';
import { createTokenForUser } from './decorators/auth/utils';
import { IUserAuthData, IUserLight, UserRole } from './types/user.types';

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private userRepository!: MongoRepository<UserEntity>;

  @Inject(AsyncLocalStorage)
  private readonly als: AsyncLocalStorage<any>;

  @Inject(PetService)
  private petService!: PetService;

  public async getMeUser() {
    const user = this.als.getStore().user as UserEntity;

    const pets = await this.petService.getPets(user);

    const result: IUserLight = {
      _id: user._id,
      pets: pets ?? [],
      roles: user.roles,
      profile: user.profile
    };

    return result;
  }

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

  public async findUser({ id, identifier }: IFindUserData) {
    let where: FindOptionsWhere<UserEntity>;

    if (id instanceof ObjectId) {
      where = { _id: id };
    } else if (id) {
      where = { _id: ObjectId.createFromHexString(id) };
    } else {
      where = identifier ? { identifier } : null;
    }

    return await this.userRepository.findOne({ where });
  }

  public async createUser(data: RegisterRequestDto) {
    const isExists = await this.isUserExists({ identifier: data.identifier });

    if (isExists) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = encryptPassword(data.password);

    const userEntity = new UserEntity();

    userEntity.profile = data.profile;
    userEntity.identifier = data.identifier;
    userEntity.roles = [data.role ?? UserRole.Client];

    userEntity.password = passwordHash;

    const savedUser = await this.userRepository.save(userEntity);

    if (data.pets?.length) {
      await this.petService.addPets(data.pets, savedUser);
    }

    return this.authUser({
      password: data.password,
      identifier: data.identifier
    });
  }

  public async updateUser(user: UserEntity) {
    await this.userRepository.save(user);
  }

  private async isUserExists(data: IFindUserData) {
    const user = await this.findUser(data);
    return !!user;
  }
}
