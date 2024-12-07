import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateClubData } from './type/create-club-data.type';
import { ClubData } from './type/club-data.type';
import { JoinState } from '@prisma/client';

@Injectable()
export class ClubRepository {
  constructor(private readonly prisma: PrismaService) {}

  async clubNameExist(clubName: string): Promise<boolean> {
    const club = await this.prisma.club.findUnique({
      where: {
        name: clubName,
      },
    });

    return !!club;
  }

  async createClub(data: CreateClubData): Promise<ClubData> {
    return this.prisma.club.create({
      data: {
        ownerId: data.ownerId,
        name: data.name,
        description: data.description,
        maxCapacity: data.maxCapacity,
        clubJoin: {
          create: {
            userId: data.ownerId,
            joinState: JoinState.JOINED,
          },
        },
      },
    });
  }

  async getClubById(clubId: number): Promise<ClubData | null> {
    return this.prisma.club.findUnique({
      where: {
        id: clubId,
      },
      select: {
        id: true,
        ownerId: true,
        name: true,
        description: true,
        maxCapacity: true,
      },
    });
  }

  async getJoinState(
    clubId: number,
    userId: number,
  ): Promise<JoinState | undefined> {
    const clubJoin = await this.prisma.clubJoin.findUnique({
      where: {
        clubId_userId: {
          clubId,
          userId,       
        },
        user: {
          deletedAt: null,
        },
      },
      select: {
        joinState: true,
      },
    });

    return clubJoin?.joinState;
  }

  async countJoinedUsers(clubId: number): Promise<number> {
    const countJoinedUsers = await this.prisma.clubJoin.count({
      where: {
        clubId,
        user: {
          deletedAt: null,
        },
        joinState: JoinState.JOINED,
      },
    });

    return countJoinedUsers;
  }

  async joinClub(clubId: number, userId: number): Promise<void> {
    await this.prisma.clubJoin.create({
      data: { clubId, userId, joinState: JoinState.PENDING },
    });
  }
}