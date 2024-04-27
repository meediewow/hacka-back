import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  AuthRequestDto,
  RegisterRequestDto,
  TokenResponseDto,
  UserDto
} from './dto';
import { GuardGet, GuardPost } from './decorators';
import { UserService } from './user.service';
import { UserRole } from './types/user.types';
import { UserUpdateRequestDto } from './dto/user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get/:userId')
  @ApiParam({
    type: 'string',
    name: 'userId',
    example: '662cf548b0c0585ff5eb4b5d'
  })
  @ApiResponse({ type: UserDto })
  public async getUser(@Param() { userId }: { userId: string }) {
    return await this.userService.findByIdOrFail(userId);
  }

  @GuardGet([UserRole.Client, UserRole.Sitter], 'me')
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

  @GuardPost([UserRole.Client, UserRole.Sitter], 'update')
  @ApiBody({ type: UserUpdateRequestDto })
  @ApiResponse({ type: UserDto })
  public async update(@Body() body: UserUpdateRequestDto) {
    return await this.userService.updateUserSafe(body);
  }
}
