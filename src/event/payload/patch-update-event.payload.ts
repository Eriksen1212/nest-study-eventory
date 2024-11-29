import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class PatchUpdateEventPayload {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '모임 이름',
    type: String,
  })
  title?: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '모임 설명',
    type: String,
  })
  description?: string | null;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({
    description: '카테고리 ID',
    type: Number,
  })
  categoryId?: number | null;

  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsArray()
  @ApiPropertyOptional({
    description: '도시 IDs',
    type: [Number],
  })
  cityIds?: number[] | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({
    description: '이벤트 시작 시간',
    type: Date,
  })
  startTime?: Date | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({
    description: '이벤트 종료 시간',
    type: Date,
  })
  endTime?: Date | null;

  @IsOptional()
  @Min(2)
  @IsInt()
  @ApiPropertyOptional({
    description: '이벤트에 참여가능한 최대 인원',
    type: Number,
  })
  maxPeople?: number | null;
}
