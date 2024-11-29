import { PrismaService } from '../common/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CategoryData } from './type/category-data.type';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories(): Promise<CategoryData[]> {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
}
