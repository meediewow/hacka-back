import { Body, Controller, Inject } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GuardGet, GuardPost } from '../user/decorators';
import { UserRole } from '../user/types/user.types';

import { OrderService } from './order.service';
import { OrderResponseDto } from './dto/order.dto';
import { ChangeOrderStatusRequestDto } from './dto/change-order-status.dto';

@ApiTags('Sitter order')
@Controller('sitter-order')
export class SitterOrderController {
  @Inject(OrderService)
  private readonly orderService: OrderService;

  @GuardPost([UserRole.Sitter], 'change-status')
  @ApiBody({ type: ChangeOrderStatusRequestDto })
  @ApiResponse({ type: OrderResponseDto })
  public async changeSitterStatus(@Body() body: ChangeOrderStatusRequestDto) {
    return this.orderService.changeSitterStatus(body);
  }

  @GuardGet([UserRole.Sitter])
  @ApiResponse({ type: OrderResponseDto, isArray: true })
  public async getClientOrders() {
    return this.orderService.getSitterOrders();
  }
}
