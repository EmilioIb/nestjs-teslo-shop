import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { SeedService } from './seed.service';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from 'src/auth/decorators';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Seed executed sucessfully',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  // @Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
