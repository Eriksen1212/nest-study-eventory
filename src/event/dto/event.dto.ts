import { ApiProperty } from '@nestjs/swagger';
import { EventData } from '../type/event-data.type';

export class EventDto {
  @ApiProperty({
    description: '모임 ID',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: '호스트 ID',
    type: Number,
  })
  hostId!: number;

  @ApiProperty({
    description: '이름',
    type: String,
  })
  title!: string;

  @ApiProperty({
    description: '설명',
    type: String,
  })
  description!: string;

  @ApiProperty({
    description: '카테고리 ID',
    type: Number,
  })
  categoryId!: number;

  @ApiProperty({
    description: '도시 IDs',
    type: [Number],
  })
  cityIds!: number[];

  @ApiProperty({
    description: '시작 시간',
    type: Date,
  })
  startTime!: Date;

  @ApiProperty({
    description: '종료 시간',
    type: Date,
  })
  endTime!: Date;

  @ApiProperty({
    description: '최대 인원',
    type: Number,
  })
  maxPeople!: number;

  static from(data: EventData): EventDto {
    return {
      id: data.id,
      hostId: data.hostId,
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      cityIds: data.eventCity.map((city) => city.cityId),
      startTime: data.startTime,
      endTime: data.endTime,
      maxPeople: data.maxPeople,
    };
  }

  static fromArray(data: EventData[]): EventDto[] {
    return data.map((event) => EventDto.from(event));
  }
}

export class EventListDto {
  @ApiProperty({
    description: '모임 목록',
    type: [EventDto],
  })
  events!: EventDto[];

  static from(data: EventData[]): EventListDto {
    return {
      events: EventDto.fromArray(data),
    };
  }
}
