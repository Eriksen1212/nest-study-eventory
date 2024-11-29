import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventPayload } from './payload/create-event.payload';
import { UserBaseInfo } from '../auth/type/user-base-info.type';
import { EventDto, EventListDto } from './dto/event.dto';
import { CreateEventData } from './type/create-event-data.type';
import { EventRepository } from './event.repository';
import { EventQuery } from './query/event.query';
import { EventDetailDto } from './dto/event-detail.dto';
import { PutUpdateEventPayload } from './payload/put-update-event.payload';
import { UpdateEventData } from './type/update-event-data.type';
import { PatchUpdateEventPayload } from './payload/patch-update-event.payload';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async createEvent(
    payload: CreateEventPayload,
    user: UserBaseInfo,
  ): Promise<EventDto> {
    const [category, cities] = await Promise.all([
      this.eventRepository.findCategoryById(payload.categoryId),
      this.eventRepository.findCitiesByIds(payload.cityIds),
    ]);

    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    if (cities.length !== payload.cityIds.length) {
      throw new NotFoundException('도시를 찾을 수 없습니다.');
    }

    if (payload.startTime >= payload.endTime) {
      throw new BadRequestException('시작 시간은 종료 시간보다 빨라야 합니다 ');
    }

    if (payload.startTime < new Date()) {
      throw new BadRequestException(
        '모임 시작 시간은 현재 시간 이후여야 합니다.',
      );
    }

    const data: CreateEventData = {
      hostId: user.id,
      title: payload.title,
      description: payload.description,
      categoryId: payload.categoryId,
      cityIds: payload.cityIds,
      startTime: payload.startTime,
      endTime: payload.endTime,
      maxPeople: payload.maxPeople,
    };

    const event = await this.eventRepository.createEvent(data);

    return EventDto.from(event);
  }

  async getEvents(query: EventQuery): Promise<EventListDto> {
    const events = await this.eventRepository.getEvents(query);

    return EventListDto.from(events);
  }

  async getMyEvents(user: UserBaseInfo): Promise<EventListDto> {
    const events = await this.eventRepository.getEventsJoinedBy(user.id);

    return EventListDto.from(events);
  }

  async getEventById(eventId: number): Promise<EventDetailDto> {
    const event = await this.eventRepository.findEventDetailById(eventId);

    if (!event) {
      throw new NotFoundException('모임을 찾을 수 없습니다.');
    }

    return EventDetailDto.from(event);
  }

  async putUpdateEvent(
    eventId: number,
    payload: PutUpdateEventPayload,
    user: UserBaseInfo,
  ): Promise<EventDto> {
    const event = await this.eventRepository.findEventById(eventId);

    if (!event) {
      throw new NotFoundException('모임을 찾을 수 없습니다.');
    }

    if (event.hostId !== user.id) {
      throw new ForbiddenException('모임 주최자만 수정할 수 있습니다');
    }

    if (payload.startTime >= payload.endTime) {
      throw new BadRequestException('시작 시간은 종료 시간보다 빨라야 합니다.');
    }

    if (payload.startTime < new Date()) {
      throw new BadRequestException(
        '모임 시작 시간은 현재 시간 이후여야 합니다.',
      );
    }

    const [category, cities] = await Promise.all([
      this.eventRepository.findCategoryById(payload.categoryId),
      this.eventRepository.findCitiesByIds(payload.cityIds),
    ]);

    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    if (cities.length !== payload.cityIds.length) {
      throw new NotFoundException('도시를 찾을 수 없습니다.');
    }

    const data: UpdateEventData = {
      title: payload.title,
      description: payload.description,
      categoryId: payload.categoryId,
      cityIds: payload.cityIds,
      startTime: payload.startTime,
      endTime: payload.endTime,
      maxPeople: payload.maxPeople,
    };

    const updatedEvent = await this.eventRepository.updateEvent(eventId, data);

    return EventDto.from(updatedEvent);
  }

  async patchUpdateEvent(
    eventId: number,
    payload: PatchUpdateEventPayload,
    user: UserBaseInfo,
  ): Promise<EventDto> {
    const data = this.validateNullOf(payload);

    const event = await this.eventRepository.findEventById(eventId);

    if (!event) {
      throw new NotFoundException('모임을 찾을 수 없습니다.');
    }

    if (event.hostId !== user.id) {
      throw new ForbiddenException('모임 주최자만 수정할 수 있습니다');
    }

    const startTime = payload.startTime ?? event.startTime;
    const endTime = payload.endTime ?? event.endTime;

    if (startTime >= endTime) {
      throw new BadRequestException('시작 시간은 종료 시간보다 빨라야 합니다.');
    }

    if (startTime < new Date()) {
      throw new BadRequestException(
        '모임 시작 시간은 현재 시간 이후여야 합니다.',
      );
    }

    if (payload.categoryId) {
      const category = await this.eventRepository.findCategoryById(
        payload.categoryId,
      );
      if (!category) {
        throw new NotFoundException('카테고리를 찾을 수 없습니다.');
      }
    }

    if (payload.cityIds) {
      const cities = await this.eventRepository.findCitiesByIds(
        payload.cityIds,
      );
      if (cities.length !== payload.cityIds.length) {
        throw new NotFoundException('도시를 찾을 수 없습니다.');
      }
    }

    if (payload.maxPeople) {
      const participantsIds =
        await this.eventRepository.getParticipantsIds(eventId);

      if (participantsIds.length > payload.maxPeople) {
        throw new ConflictException(
          '현재 참가 인원보다 적은 수로 변경할 수 없습니다.',
        );
      }
    }

    const updatedEvent = await this.eventRepository.updateEvent(eventId, data);

    return EventDto.from(updatedEvent);
  }

  async deleteEvent(eventId: number, user: UserBaseInfo): Promise<void> {
    const event = await this.eventRepository.findEventById(eventId);

    if (!event) {
      throw new NotFoundException('모임을 찾을 수 없습니다.');
    }

    if (event.hostId !== user.id) {
      throw new ForbiddenException('모임 주최자만 삭제할 수 있습니다.');
    }

    await this.eventRepository.deleteEvent(eventId);
  }

  async joinEvent(eventId: number, user: UserBaseInfo): Promise<void> {
    const event = await this.eventRepository.findEventById(eventId);

    if (!event) {
      throw new NotFoundException('모임을 찾을 수 없습니다.');
    }

    if (event.startTime < new Date()) {
      throw new ConflictException('이미 시작된 모임에 참여할 수 없습니다.');
    }

    const participantsIds =
      await this.eventRepository.getParticipantsIds(eventId);

    if (participantsIds.includes(user.id)) {
      throw new ConflictException('이미 참여한 모임입니다.');
    }

    if (participantsIds.length >= event.maxPeople) {
      throw new ConflictException('인원이 가득 찼습니다.');
    }

    await this.eventRepository.joinEvent(eventId, user.id);
  }

  async leaveEvent(eventId: number, user: UserBaseInfo): Promise<void> {
    const event = await this.eventRepository.findEventById(eventId);

    if (!event) {
      throw new NotFoundException('모임을 찾을 수 없습니다.');
    }

    if (event.hostId === user.id) {
      throw new ConflictException('모임 주최자는 모임에서 나갈 수 없습니다.');
    }

    if (event.startTime < new Date()) {
      throw new ConflictException('이미 시작된 모임에서 나갈 수 없습니다.');
    }

    const participantsIds =
      await this.eventRepository.getParticipantsIds(eventId);

    if (!participantsIds.includes(user.id)) {
      throw new ConflictException('참여하지 않은 모임입니다.');
    }

    await this.eventRepository.leaveEvent(eventId, user.id);
  }

  private validateNullOf(payload: PatchUpdateEventPayload): UpdateEventData {
    if (payload.title === null) {
      throw new BadRequestException('title은 null이 될 수 없습니다.');
    }

    if (payload.description === null) {
      throw new BadRequestException('description은 null이 될 수 없습니다.');
    }

    if (payload.categoryId === null) {
      throw new BadRequestException('categoryId는 null이 될 수 없습니다.');
    }

    if (payload.cityIds === null) {
      throw new BadRequestException('cityIds는 null이 될 수 없습니다.');
    }

    if (payload.startTime === null) {
      throw new BadRequestException('startTime은 null이 될 수 없습���다.');
    }

    if (payload.endTime === null) {
      throw new BadRequestException('endTime은 null이 될 수 없습니다.');
    }

    if (payload.maxPeople === null) {
      throw new BadRequestException('maxPeople은 null이 될 수 없습니다.');
    }

    return {
      title: payload.title,
      description: payload.description,
      categoryId: payload.categoryId,
      cityIds: payload.cityIds,
      startTime: payload.startTime,
      endTime: payload.endTime,
      maxPeople: payload.maxPeople,
    };
  }
}
