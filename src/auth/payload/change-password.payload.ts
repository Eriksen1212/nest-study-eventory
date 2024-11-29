import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordPayload {
  @IsString()
  @ApiProperty({
    description: '현재 비밀번호',
    type: String,
  })
  currentPassword!: string;

  @IsString()
  @ApiProperty({
    description: '새 비밀번호',
    type: String,
  })
  newPassword!: string;
}
