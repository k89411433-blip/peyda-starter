import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
class CreateListingDto {
  @IsString() @MinLength(3) @MaxLength(120) title!: string;
  @IsString() @MinLength(10) @MaxLength(10000) description!: string;
  @IsString() categoryId!: string;
  @IsOptional() @IsString() province?: string;
  @IsOptional() @IsString() city?: string;
}
@ApiTags('listings')
@Controller('listings')
export class ListingsController {
  constructor(private prisma: PrismaService) {}
  @Get() async list(@Query('q') q?: string, @Query('province') province?: string) {
    return this.prisma.listing.findMany({ where: { status: 'PUBLISHED', ...(province ? { province } : {}), ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {}) }, include: { media: true, category: { select: { id: true, titleFa: true, slug: true } }, seller: { select: { id: true, displayName: true } } }, orderBy: { publishedAt: 'desc' }, take: 30 });
  }
  @Post() @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  async create(@Req() req: any, @Body() dto: CreateListingDto) {
    return this.prisma.listing.create({ data: { sellerId: req.user.sub, categoryId: dto.categoryId, title: dto.title, description: dto.description, province: dto.province, city: dto.city, status: 'PENDING' } });
  }
}
