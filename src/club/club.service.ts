import { ClubRepository } from './club.repository';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateClubPayload } from './payload/create-club.payload';
import { ClubDto } from './dto/club.dto';
import { CreateClubData } from './type/create-club-data.type';

@Injectable()
export class ClubService {
  constructor(private readonly clubRepository: ClubRepository) {}

  async createClub(
    userId: number,
    payload: CreateClubPayload,
  ): Promise<ClubDto> {
    const clubNameExist = await this.clubRepository.clubNameExist(payload.name);

    if (clubNameExist) {
      throw new ConflictException('동일한 클럽 이름이 이미 존재합니다.');
    }

    const createData: CreateClubData = {
      ownerId: userId,
      name: payload.name,
      description: payload.description,
      maxCapacity: payload.maxCapacity,
    };

    const club = await this.clubRepository.createClub(createData);

    return ClubDto.from(club);
  }
}