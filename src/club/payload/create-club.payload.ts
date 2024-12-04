import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateClubPayload {
  @IsString()
  @ApiProperty({
    description: '클럽 이름',
    type: String,
  })
  name!: string;

  @IsString()
  @ApiProperty({
    description: '클럽 소개',
    type: String,
  })
  description!: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    description: '클럽 최대 인원',
    type: Number,
  })
  maxCapacity!: number;
}