import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Role } from '../prisma/client';
import { CurrentUser } from '../auth/authenticated-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { AvatarService } from './avatar.service';
import { UpdateAvatarLoadoutDto } from './dto/update-avatar-loadout.dto';

@Controller('children/:childId/avatar')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Get()
  @Roles(Role.ADMIN, Role.PARENT, Role.CHILD)
  getAvatar(@CurrentUser() user: AuthenticatedUser, @Param('childId') childId: string) {
    return this.avatarService.getAvatar(user, childId);
  }

  @Put('loadout')
  @Roles(Role.ADMIN, Role.PARENT, Role.CHILD)
  updateLoadout(
    @CurrentUser() user: AuthenticatedUser,
    @Param('childId') childId: string,
    @Body() dto: UpdateAvatarLoadoutDto
  ) {
    return this.avatarService.updateLoadout(user, childId, dto);
  }
}
