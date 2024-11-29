import { PrismaService } from '../common/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Category, User } from '@prisma/client';
import { UpdateUserData } from '../auth/type/update-user-data.type';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });
  }

  async updateUser(userId: number, data: UpdateUserData): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
        email: data.email,
        birthday: data.birthday,
        cityId: data.cityId,
        categoryId: data.categoryId,
      },
    });
  }

  async isEmailExist(email: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    return !!user;
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async getCityById(id: number): Promise<Category | null> {
    return this.prisma.city.findUnique({
      where: {
        id,
      },
    });
  }

  async deleteUser(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
