import { Inject, Injectable } from '@nestjs/common';

import { UserDto } from '../dto';
import { SittersRequestDto } from '../dto/sitters.dto';
import { UserRepository } from '../user.repository';
import { OrderService } from '../../order/order.service';

@Injectable()
export class SittersService {
  @Inject(UserRepository)
  private userRepository: UserRepository;

  @Inject(OrderService)
  private readonly orderService: OrderService;

  public async getSittersList(args: SittersRequestDto): Promise<UserDto[]> {
    const users = await this.userRepository.getSittersList(args);
    // TODO: add price calculation
    return users.map((u) =>
      UserDto.fromEntity({
        ...u,
        price: this.orderService.calculatePrice(
          u,
          args.category ?? [],
          args.period
        )
      })
    );
  }
}
