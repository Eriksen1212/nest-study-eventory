import { Get, Injectable } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CategoryListDto } from './dto/category.dto';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getCategories(): Promise<CategoryListDto> {
    const categories = await this.categoryRepository.getCategories();

    return CategoryListDto.from(categories);
  }
}
