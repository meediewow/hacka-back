import { Inject, Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto';

import { SittersRequestDto } from './dto/sitters.dto';

@Injectable()
export class SittersService {
  @Inject(UserService)
  private userService: UserService;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getSittersList(_: SittersRequestDto) {
    const repository = this.userService.getRepository();
    const users = await repository.find();
    return users.map((user) => UserDto.fromEntity(user));
  }
}
