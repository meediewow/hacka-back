import { Body, Controller, Inject, Param } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GuardGet, GuardPost } from '../../user/decorators';
import { OrderService } from '../order.service';
import { OrderResponseDto } from '../dto/order.dto';
import { ChangeOrderStatusRequestDto } from '../dto/change-order-status.dto';
import { UserRole } from '../../user/types/user.types';

@ApiTags('Sitter order')
@Controller('sitter-order')
export class SitterOrderController {
  @Inject(OrderService)
  private readonly orderService: OrderService;

  @GuardPost([UserRole.Sitter], 'pay')
  @ApiBody({ type: ChangeOrderStatusRequestDto })
  @ApiResponse({ type: OrderResponseDto })
  public async pay(@Body() body: ChangeOrderStatusRequestDto) {
    return this.orderService.pay(body);
  }

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

  @GuardGet([UserRole.Sitter], '/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ type: OrderResponseDto })
  public async getOrder(@Param('id') id: string) {
    return this.orderService.getSitterOrderById(id);
  }
}
