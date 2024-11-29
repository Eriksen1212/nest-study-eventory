import { ApiProperty } from '@nestjs/swagger';
import { UserData } from '../type/user-data.type';

export class UserDto {
  @ApiProperty({
    description: '유저 ID',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: '이메일',
    type: String,
  })
  email!: string;

  @ApiProperty({
    description: '이름',
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: '생일',
    type: Date,
    nullable: true,
  })
  birthday!: Date | null;

  @ApiProperty({
    description: '도시 ID',
    type: Number,
    nullable: true,
  })
  cityId!: number | null;

  @ApiProperty({
    description: '카테고리 ID',
    type: Number,
  })
  categoryId!: number;

  static from(data: UserData): UserDto {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      birthday: data.birthday,
      cityId: data.cityId,
      categoryId: data.categoryId,
    };
  }
}
