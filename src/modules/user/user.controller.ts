import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  AuthRequestDto,
  RegisterRequestDto,
  TokenResponseDto,
  UserDto
} from './dto';
import { GuardGet } from './decorators';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiParam({ type: 'string', name: 'userId', example: '00-0000-0000' })
  @ApiResponse({ type: UserDto })
  public getUser(@Param() {}: { userId: string }) {}

  @GuardGet('me')
  @ApiResponse({ type: UserDto })
  public getMe() {
    return this.userService.getMeUser();
  }

  @Post('auth')
  @ApiBody({ type: AuthRequestDto })
  @ApiResponse({ type: TokenResponseDto })
  public async auth(@Body() body: AuthRequestDto) {
    return await this.userService.authUser(body);
  }

  @Post('register')
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({ type: TokenResponseDto })
  public async registration(@Body() body: RegisterRequestDto) {
    return await this.userService.createUser(body);
  }

  // TODO: Пока не делаем
  public logout() {}
}
