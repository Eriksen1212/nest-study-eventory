import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateClubData } from './type/create-club-data.type';
import { ClubData } from './type/club-data.type';
import { JoinState } from '@prisma/client';
import { UpdateClubData } from './type/update-club-data.type';

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

  async outClub(clubId: number, userId: number): Promise<void> {
    return this.prisma.$transaction(async (prisma) => {
      const clubEventsJoinedByUser = await prisma.event.findMany({
        where: {
          clubId,
          eventJoin: {
            some: {
              userId,
            },
          },
        },
        select: {
          id: true,
          startTime: true,
          hostId: true,
        },
      });

      const deleteEvents = clubEventsJoinedByUser
        .filter(
          (event) => new Date() < event.startTime && event.hostId === userId,
        )
        .map((event) => event.id);

      const removeEventJoins = clubEventsJoinedByUser
        .filter(
          (event) => new Date() < event.startTime && event.hostId !== userId,
        )
        .map((event) => ({
          eventId: event.id,
        }));

      if (deleteEvents.length > 0) {
        await prisma.event.deleteMany({
          where: {
            id: { in: deleteEvents },
          },
        });
      }

      if (removeEventJoins.length > 0) {
        await prisma.eventJoin.deleteMany({
          where: {
            userId,
            eventId: {
              in: removeEventJoins.map((event) => event.eventId),
            },
          },
        });
      }

      await this.prisma.clubJoin.delete({
        where: {
          clubId_userId: {
            clubId,
            userId,
          },
        },
      });
    });
  }

  async getClubs(): Promise<ClubData[]> {
    return this.prisma.club.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        maxCapacity: true,
      },
    });
  }

  async getMyClubs(userId: number): Promise<ClubData[]> {
    return this.prisma.club.findMany({
      where: {
        clubJoin: {
          some: {
            userId: userId,
            joinState: JoinState.JOINED,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        maxCapacity: true,
      },
    });
  }

  async getClubMemberCount(clubId: number): Promise<number> {
    return this.prisma.clubJoin.count({
      where: {
        clubId: clubId,
        joinState: JoinState.JOINED,
      },
    });
  }

  async updateClub(clubId: number, data: UpdateClubData): Promise<ClubData> {
    return this.prisma.club.update({
      where: {
        id: clubId,
      },
      data: {
        name: data.name,
        description: data.description,
        maxCapacity: data.maxCapacity,
      },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        maxCapacity: true,
      },
    });
  }

  async deleteClub(clubId: number): Promise<void> {
    const clubEvents = await this.prisma.event.findMany({
      where: {
        clubId,
      },
    });
    return this.prisma.$transaction(async (prisma) => {
      prisma.club.delete({
        where: {
          id: clubId,
        },
      });

      //아직 진행되지 않은 이벤트
      const deleteEvents = clubEvents
        .filter((event) => new Date() < event.startTime)
        .map((event) => event.id);

      //이미 진행된 이벤트, 아카이브로 넣어줌
      const updateArchiveEvents = clubEvents
        .filter((event) => new Date() >= event.startTime)
        .map((event) => event.id);

      if (deleteEvents.length > 0) {
        await prisma.event.deleteMany({
          where: {
            id: {
              in: deleteEvents,
            },
          },
        });
      }

      if (updateArchiveEvents.length > 0) {
        await prisma.event.updateMany({
          where: {
            id: {
              in: updateArchiveEvents,
            },
          },
          data: {
            clubId: null,
            isArchived: true,
          },
        });
      }
    });
  }

  async delegate(clubId: number, userId: number): Promise<ClubData> {
    return this.prisma.club.update({
      where: { id: clubId },
      data: {
        ownerId: userId,
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

  async approve(clubId: number, userId: number): Promise<void> {
    await this.prisma.clubJoin.update({
      where: {
        clubId_userId: {
          clubId,
          userId,          
        },
      },
      data: { joinState: JoinState.JOINED },
    });
  } 

}
