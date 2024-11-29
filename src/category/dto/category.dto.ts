import { ApiProperty } from '@nestjs/swagger';
import { CategoryData } from '../type/category-data.type';

export class CategoryDto {
  @ApiProperty({
    description: '카테고리 ID',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: '카테고리 이름',
    type: String,
  })
  name!: string;

  static from(data: CategoryData): CategoryDto {
    return {
      id: data.id,
      name: data.name,
    };
  }

  static fromArray(data: CategoryData[]): CategoryDto[] {
    return data.map(CategoryDto.from);
  }
}

export class CategoryListDto {
  @ApiProperty({
    description: '카테고리 목록',
    type: [CategoryDto],
  })
  categories!: CategoryDto[];

  static from(data: CategoryData[]): CategoryListDto {
    return {
      categories: CategoryDto.fromArray(data),
    };
  }
}
