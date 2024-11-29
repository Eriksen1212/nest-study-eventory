import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EventService } from './event.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { EventDto, EventListDto } from './dto/event.dto';
import { CreateEventPayload } from './payload/create-event.payload';
import { CurrentUser } from '../auth/decorator/user.decorator';
import { UserBaseInfo } from '../auth/type/user-base-info.type';
import { EventQuery } from './query/event.query';
import { EventDetailDto } from './dto/event-detail.dto';
import { PutUpdateEventPayload } from './payload/put-update-event.payload';
import { PatchUpdateEventPayload } from './payload/patch-update-event.payload';

@Controller('events')
@ApiTags('Event API')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '모임 생성' })
  @ApiCreatedResponse({ type: EventDto })
  async createEvent(
    @Body() payload: CreateEventPayload,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<EventDto> {
    return this.eventService.createEvent(payload, user);
  }

  @Get()
  @ApiOperation({ summary: '모임 전체 또는 필터 조회' })
  @ApiOkResponse({ type: EventListDto })
  async getEvents(@Query() query: EventQuery): Promise<EventListDto> {
    return this.eventService.getEvents(query);
  }

  @Get(':eventId')
  @ApiOperation({ summary: '모임 상세 조회' })
  @ApiOkResponse({ type: EventDetailDto })
  async getEventById(
    @Param('eventId', ParseIntPipe) eventId: number,
  ): Promise<EventDetailDto> {
    return this.eventService.getEventById(eventId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내가 참여한 모임 조회' })
  @ApiOkResponse({ type: EventListDto })
  async getMyEvents(@CurrentUser() user: UserBaseInfo): Promise<EventListDto> {
    return this.eventService.getMyEvents(user);
  }

  @Put(':eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '모임 수정 (PUT)' })
  @ApiOkResponse({ type: EventDto })
  async putUpdateEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() payload: PutUpdateEventPayload,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<EventDto> {
    return this.eventService.putUpdateEvent(eventId, payload, user);
  }

  @Patch(':eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '모임 수정 (PATCH)' })
  @ApiOkResponse({ type: EventDto })
  async patchUpdateEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() payload: PatchUpdateEventPayload,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<EventDto> {
    return this.eventService.patchUpdateEvent(eventId, payload, user);
  }

  @Delete(':eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNoContentResponse()
  async deleteEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<void> {
    return this.eventService.deleteEvent(eventId, user);
  }

  @Post(':eventId/join')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '모임 참가' })
  @ApiNoContentResponse()
  async joinEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<void> {
    return this.eventService.joinEvent(eventId, user);
  }

  @Post(':eventId/leave')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '모임 나가기' })
  @ApiNoContentResponse()
  async leaveEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<void> {
    return this.eventService.leaveEvent(eventId, user);
  }
}
