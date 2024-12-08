import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateClubPayload {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '클럽 이름',
    type: String,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '클럽 소개',
    type: String,
  })
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: '클럽 최대 정원',
    type: Number,
  })
  maxCapacity?: number;
}
