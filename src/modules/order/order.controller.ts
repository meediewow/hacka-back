import { Body, Controller, Inject } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GuardPost } from '../user/decorators';
import { UserRole } from '../user/types/user.types';

import { OrderService } from './order.service';
import { OrderRequestDto, OrderResponseDto } from './dto/order.dto';
import { ChangeOrderStatusRequestDto } from './dto/change-order-status.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  @Inject(OrderService)
  private readonly orderService: OrderService;

  @GuardPost([UserRole.Client])
  @ApiBody({ type: OrderRequestDto })
  @ApiResponse({ type: OrderResponseDto })
  public async auth(@Body() body: OrderRequestDto) {
    return await this.orderService.createOrder(body);
  }

  @GuardPost([UserRole.Sitter], 'change-sitter-status')
  @ApiBody({ type: ChangeOrderStatusRequestDto })
  @ApiResponse({ type: OrderResponseDto })
  public async changeSitterStatus() {
    // @Body() body: ChangeOrderStatusRequestDto
    //
  }
}
