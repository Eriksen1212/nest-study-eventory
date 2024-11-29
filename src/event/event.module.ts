import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventRepository } from './event.repository';

@Module({
  controllers: [EventController],
  providers: [EventService, EventRepository],
})
export class EventModule {}
