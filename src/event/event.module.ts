import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventRepository } from './event.repository';
import { ClubRepository } from '../club/club.repository';

@Module({
  controllers: [EventController],
  providers: [EventService, EventRepository, ClubRepository],
})
export class EventModule {}
