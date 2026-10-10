import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
@Module({ controllers: [AdminController], providers: [PrismaService, JwtAuthGuard, RolesGuard] })
export class AdminModule {}
