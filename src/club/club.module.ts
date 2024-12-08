import { Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { ClubRepository } from './club.repository';

@Module({
  providers: [ClubService, ClubRepository],
  controllers: [ClubController],
})
export class ClubModule {}
