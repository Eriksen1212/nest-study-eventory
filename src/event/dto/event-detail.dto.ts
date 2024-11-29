import { ApiProperty } from '@nestjs/swagger';
import { EventDetailData } from '../type/event-detail-data.type';
import { ReviewDto } from '../../review/dto/review.dto';
import { EventStatus } from '../enum/event.enum';

export class SimpleUserDto {
  @ApiProperty({
    description: '유저 ID',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: '유저 이름',
    type: String,
  })
  name!: string;
}

export class EventDetailDto {
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

  @ApiProperty({
    description: '이벤트의 현재 상태',
    enum: EventStatus,
  })
  status!: EventStatus;

  @ApiProperty({
    description: '참가자',
    type: [SimpleUserDto],
  })
  participants!: SimpleUserDto[];

  @ApiProperty({
    description: '리뷰',
    type: [ReviewDto],
  })
  reviews!: ReviewDto[];

  static from(data: EventDetailData): EventDetailDto {
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
      reviews: data.review.map(ReviewDto.from),
      participants: data.eventJoin.map((join) => ({
        id: join.user.id,
        name: join.user.name,
      })),
      status:
        data.startTime > new Date()
          ? EventStatus.PENDING
          : data.endTime < new Date()
            ? EventStatus.COMPLETED
            : EventStatus.ONGOING,
    };
  }
}
