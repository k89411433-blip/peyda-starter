import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private prisma: PrismaService) {}
  @Get('dashboard') async dashboard() {
    const [users, listings, pendingListings, stories] = await Promise.all([
      this.prisma.user.count(), this.prisma.listing.count(),
      this.prisma.listing.count({ where: { status: 'PENDING' } }),
      this.prisma.story.count({ where: { expiresAt: { gt: new Date() } } }),
    ]);
    return { users, listings, pendingListings, activeStories: stories };
  }
}
