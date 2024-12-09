import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ApprovePayload {
  @IsInt()
  @ApiProperty({
    description: '클럽 가입 승인할 유저 ID',
    type: Number,
  })
  userId!: number;
}