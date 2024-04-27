import { Body, Controller, Inject, Param } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GuardGet, GuardPost } from '../user/decorators';
import { UserRole } from '../user/types/user.types';

import { OrderService } from './order.service';
import { OrderRequestDto, OrderResponseDto } from './dto/order.dto';
import { ChangeOrderStatusRequestDto } from './dto/change-order-status.dto';

@ApiTags('Client order')
@Controller('client-order')
export class ClientOrderController {
  @Inject(OrderService)
  private readonly orderService: OrderService;

  @GuardPost([UserRole.Client], 'create')
  @ApiBody({ type: OrderRequestDto })
  @ApiResponse({ type: OrderResponseDto })
  public async createOrder(@Body() body: OrderRequestDto) {
    return this.orderService.createOrder(body);
  }

  @GuardPost([UserRole.Client], 'change-status')
  @ApiBody({ type: ChangeOrderStatusRequestDto })
  @ApiResponse({ type: OrderResponseDto })
  public async changeClientStatus(@Body() body: ChangeOrderStatusRequestDto) {
    return this.orderService.changeClientStatus(body);
  }

  @GuardGet([UserRole.Client])
  @ApiResponse({ type: OrderResponseDto, isArray: true })
  public async getClientOrders() {
    return this.orderService.getClientOrders();
  }

  @GuardGet([UserRole.Client], '/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ type: OrderResponseDto })
  public async getOrder(@Param('id') id: string) {
    return this.orderService.getClientOrderById(id);
  }
}
