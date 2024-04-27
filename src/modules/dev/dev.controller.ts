import {
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiResponse
} from '@nestjs/swagger';
import { Get, Post, Controller, Body, Param } from '@nestjs/common';

import { GuardGet } from '../user/decorators';
import { ListQueryParamsDto } from '../../network';

import {
  TestEntityCreateRequestDto,
  TestEntitiesListResponseDto,
  OneEntityResponseDto
} from './dto/test.entity.dto';
import { DevService } from './dev.service';
import { PingResponseDto } from './dto/ping.dto';
import { GuardResponseDto } from './dto/guard.dto';

@ApiTags('Dev')
@Controller('dev')
export class DevController {
  constructor(private readonly devService: DevService) {}

  @Get('ping')
  @ApiResponse({ type: PingResponseDto })
  getPong() {
    return { content: this.devService.pong() };
  }

  @GuardGet('guard')
  @ApiResponse({ type: GuardResponseDto })
  getAuth() {
    return { content: 'Guarded content' };
  }

  @Post('entity')
  @ApiBody({ type: TestEntityCreateRequestDto })
  @ApiResponse({ type: OneEntityResponseDto })
  async createEntity(@Body() body: TestEntityCreateRequestDto) {
    const data = await this.devService.createEntity(body.title);
    return { data };
  }

  @Get('entity')
  @ApiQuery({ type: ListQueryParamsDto, required: false })
  @ApiResponse({ type: TestEntitiesListResponseDto })
  async getEntitiesList() {
    const data = await this.devService.getAllEntities();
    return { data };
  }

  @Get('entity/:entityId')
  @ApiParam({ type: 'number', name: 'entityId', example: 42 })
  @ApiResponse({ type: OneEntityResponseDto })
  async getSingleEntity(@Param() { entityId }: { entityId: string }) {
    return { entityId };
  }
}
