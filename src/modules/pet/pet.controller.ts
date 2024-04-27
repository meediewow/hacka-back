import { Body, Controller, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GuardPost } from '../user/decorators';
import { UserRole } from '../user/types/user.types';

import { PetService } from './pet.service';
import { AddPetsRequestDto } from './dto/pet.dto';

@ApiTags('Pet')
@Controller('pet')
export class PetController {
  @Inject(PetService)
  private petService: PetService;

  @GuardPost([UserRole.Sitter, UserRole.Client])
  public async addPets(@Body() body: AddPetsRequestDto) {
    return this.petService.addPets(body.pets);
  }
}
