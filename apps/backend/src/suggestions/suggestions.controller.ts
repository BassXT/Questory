import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role } from '../prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SuggestionsService } from './suggestions.service';

@Controller('suggestions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.PARENT)
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Get()
  listSuggestions() {
    return this.suggestionsService.listSuggestions();
  }

  @Get('rewards')
  listRewardSuggestions() {
    return this.suggestionsService.listRewardSuggestions();
  }

  @Get('quests')
  listQuestSuggestions() {
    return this.suggestionsService.listQuestSuggestions();
  }
}
