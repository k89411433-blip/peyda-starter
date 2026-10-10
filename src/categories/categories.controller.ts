import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma.service';
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private prisma: PrismaService) {}
  @Get() list() { return this.prisma.category.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: 'asc' }, { titleFa: 'asc' }] }); }
}
