import { Inject, Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';

import { SittersRequestDto } from './dto/sitters.dto';
import { aggregateSitters } from './utils/sittersList.utils';

@Injectable()
export class SittersService {
  @Inject(UserService)
  private userService: UserService;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getSittersList(_: SittersRequestDto) {
    const repository = this.userService.getRepository();
    const list = await repository.find();

    return aggregateSitters(list);
  }
}
