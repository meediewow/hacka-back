import { Inject, Injectable } from '@nestjs/common';

import { UserDto } from '../dto';
import { SittersRequestDto } from '../dto/sitters.dto';

import { UserService } from './user.service';

@Injectable()
export class SittersService {
  @Inject(UserService)
  private userService: UserService;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getSittersList(_: SittersRequestDto) {
    const repository = this.userService.getRepository();
    const users = await repository.find();
    return users.map(UserDto.fromEntity);
  }
}
