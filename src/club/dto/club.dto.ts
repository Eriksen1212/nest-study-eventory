import { ApiProperty } from '@nestjs/swagger';
import { ClubData } from '../type/club-data.type';

export class ClubDto {
  @ApiProperty({
    description: '클럽 ID',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: '클럽장 ID',
    type: Number,
  })
  ownerId!: number;

  @ApiProperty({
    description: '클럽 이름',
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: '클럽 소개',
    type: String,
  })
  description!: string;

  @ApiProperty({
    description: '클럽 최대 인원',
    type: Number,
  })
  maxCapacity!: number;

  static from(club: ClubData): ClubDto {
    return {
      id: club.id,
      ownerId: club.ownerId,
      name: club.name,
      description: club.description,
      maxCapacity: club.maxCapacity,
    };
  }

  static fromArray(clubs: ClubData[]): ClubDto[] {
    return clubs.map((event) => this.from(event));
  }
}

export class ClubListDto {
  @ApiProperty({
    description: '클럽 목록',
    type: [ClubDto],
  })
  clubs!: ClubDto[];

  static from(clubs: ClubData[]): ClubListDto {
    return {
      clubs: ClubDto.fromArray(clubs),
    };
  }
}