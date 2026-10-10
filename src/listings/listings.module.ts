import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Module({ controllers: [ListingsController], providers: [PrismaService, JwtAuthGuard] })
export class ListingsModule {}
