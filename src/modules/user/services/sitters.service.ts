import { Inject, Injectable } from '@nestjs/common';

import { UserDto } from '../dto';
import { SittersRequestDto } from '../dto/sitters.dto';
import { UserRepository } from '../user.repository';

@Injectable()
export class SittersService {
  @Inject(UserRepository)
  private userRepository: UserRepository;

  public async getSittersList(args: SittersRequestDto): Promise<UserDto[]> {
    const users = await this.userRepository.getSittersList(args);
    // TODO: add price calculation
    return users.map(UserDto.fromEntity);
  }
}
