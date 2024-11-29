import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryListDto } from './dto/category.dto';

@Controller('categories')
@ApiTags('Category API')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: '카테고리 정보를 가져옵니다' })
  @ApiOkResponse({ type: CategoryListDto })
  async getCategories(): Promise<CategoryListDto> {
    return this.categoryService.getCategories();
  }
}
