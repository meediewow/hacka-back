import { AsyncLocalStorage } from 'node:async_hooks';

import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, MongoRepository } from 'typeorm';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable
} from '@nestjs/common';

import { encryptPassword } from '../../crypto';
import { PetService } from '../pet/pet.service';
import { OrderService } from '../order/order.service';

import { UserEntity } from './entities';
import { RegisterRequestDto, UserDto } from './dto';
import { IFindUserData } from './types/common.types';
import { ITokenContainer } from './types/token.types';
import { UserUpdateRequestDto } from './dto/user.dto';
import { createTokenForUser } from './decorators/auth/utils';
import { IUserAuthData, UserRole } from './types/user.types';
import { userMutationMerge } from './utils/userMerge.utils';

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private userRepository!: MongoRepository<UserEntity>;

  @Inject(AsyncLocalStorage)
  private readonly als: AsyncLocalStorage<{ user: UserEntity }>;

  @Inject(PetService)
  private petService!: PetService;

  @Inject(forwardRef(() => OrderService))
  private orderService!: OrderService;

  public getRepository(): MongoRepository<UserEntity> {
    return this.userRepository;
  }

  public async findByIdOrFail(_id: UserEntity['_id'] | string) {
    const id =
      typeof _id === 'string' ? ObjectId.createFromHexString(_id) : _id;

    return this.userRepository.findOneOrFail({
      where: { _id: id }
    });
  }

  public async getMeUser() {
    const user = this.als.getStore().user;
    const pets = await this.petService.getPets(user);
    return UserDto.fromEntity({ ...user, pets });
  }

  public async authUser(data: IUserAuthData): Promise<ITokenContainer> {
    const user = await this.userRepository.findOneOrFail({
      where: { identifier: data.identifier }
    });

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

    const user = await this.userRepository.findOne({ where });
    await this.addOrdersCountToUser(user);
    return UserDto.fromEntity(user);
  }

  public async createUser(data: RegisterRequestDto) {
    const isExists = await this.isUserExists({ identifier: data.identifier });

    if (isExists) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = encryptPassword(data.password);

    const userEntity = new UserEntity();

    userEntity.rate = 0;
    userEntity.profile = data.profile;
    userEntity.about = data.about ?? '';
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

  public async updateUserRating(_id: ObjectId, rating: number) {
    const user = await this.findByIdOrFail(_id);

    user.rate = user.rate ? (user.rate + rating) / 2 : rating;
    await this.addOrdersCountToUser(user);
    await this.userRepository.save(user);
  }

  public async updateUserSafe(data: UserUpdateRequestDto) {
    const { user } = this.als.getStore();
    const updatedUser = userMutationMerge(user, data);
    const result = await this.userRepository.save(updatedUser);

    return UserDto.fromEntity(result);
  }

  private async addOrdersCountToUser(user: UserEntity) {
    user.profile.ordersCount = await this.orderService.getOrdersCount(user._id);
  }

  private async isUserExists(data: IFindUserData) {
    const user = await this.findUser(data);
    return !!user;
  }
}
