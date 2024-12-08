import { ClubRepository } from './club.repository';
import {

  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClubPayload } from './payload/create-club.payload';
import { ClubDto, ClubListDto } from './dto/club.dto';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';
import { CreateClubData } from './type/create-club-data.type';
import { JoinState } from '@prisma/client';
import { UpdateClubData } from './type/update-club-data.type';
import { UpdateClubPayload } from './payload/update-club.payload';

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

  async joinClub(clubId: number, userId: number): Promise<void> {
    const club = await this.clubRepository.getClubById(clubId);
    if (!club) {
      throw new NotFoundException('존재하지 않는 club입니다.');
    }

    const joinState = await this.clubRepository.getJoinState(clubId, userId);
    if (joinState === JoinState.PENDING) {
      throw new ConflictException(
        '이미 가입 신청한 club입니다. 클럽장이 요청을 처리할 때까지 기다려주세요.',
      );
    }

    if (joinState === JoinState.JOINED) {
      throw new ConflictException('이미 가입한 club입니다.');
    }

    const countJoinedUsers = await this.clubRepository.countJoinedUsers(clubId);
    if (countJoinedUsers === club.maxCapacity) {
      throw new ConflictException('이미 정원이 다 찬 club입니다.');
    }

    await this.clubRepository.joinClub(clubId, userId);
  }

  async getClubById(clubId: number): Promise<ClubDto> {
    const club = await this.clubRepository.getClubById(clubId);

    if (!club) {
      throw new NotFoundException('클럽이 존재하지 않습니다.');
    }

    return ClubDto.from(club);
  }

  async getClubs(): Promise<ClubListDto> {
    const clubs = await this.clubRepository.getClubs();

    return ClubListDto.from(clubs);
  }

  async getMyClubs(user: UserBaseInfo): Promise<ClubListDto> {
    const clubs = await this.clubRepository.getMyClubs(user.id);

    return ClubListDto.from(clubs);
  }

  async updateClub(
    clubId: number,
    payload: UpdateClubPayload,
    user: UserBaseInfo,
  ): Promise<ClubDto> {
    const club = await this.clubRepository.getClubById(clubId);

    if (!club) {
      throw new NotFoundException('클럽이 존재하지 않습니다.');
    }

    if (club.ownerId !== user.id) {
      throw new ForbiddenException('클럽은 클럽장만 수정이 가능합니다.');
    }

    if (payload.name === null) {
      throw new BadRequestException('클럽 이름은 null이 될 수 없습니다.');
    }
    if (payload.description === null) {
      throw new BadRequestException('클럽 설명은 null이 될 수 없습니다.');
    }
    if (payload.maxCapacity === null) {
      throw new BadRequestException('클럽 최대 정원은 null이 될 수 없습니다.');
    }

    if (payload.maxCapacity) {
      const clubJoinCount =
        await this.clubRepository.getClubMemberCount(clubId);

      if (payload.maxCapacity < clubJoinCount) {
        throw new ConflictException(
          '새로운 클럽 정원을 현재 클럽 인원보다 적게 설정할 수 없습니다.',
        );
      }
    }

    const updateClubData: UpdateClubData = {
      name: payload.name,
      description: payload.description,
      maxCapacity: payload.maxCapacity,
    };

    const updatedClub = await this.clubRepository.updateClub(
      clubId,
      updateClubData,
    );

    return ClubDto.from(updatedClub);
  }
  
}
