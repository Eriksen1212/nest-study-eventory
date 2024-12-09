import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class DelegatePayload {
  @IsInt()
  @ApiProperty({
    description: '위임할 클럽장 ID',
    type: Number,
  })
  userId!: number;
}
