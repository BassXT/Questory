import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from '../prisma/client';
import { CurrentUser } from '../auth/authenticated-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';

@Controller('children')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Get()
  listChildren(@CurrentUser() user: AuthenticatedUser) {
    return this.childrenService.listChildren(user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.PARENT)
  createChildProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateChildDto) {
    return this.childrenService.createChildProfile(user, dto);
  }

  @Get(':childId')
  getChild(@CurrentUser() user: AuthenticatedUser, @Param('childId') childId: string) {
    return this.childrenService.getChild(user, childId);
  }
}
