import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
  import { ClubService } from './club.service';
  import { Body, Controller, Post, UseGuards } from '@nestjs/common';
  import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
  import { ClubDto } from './dto/club.dto';
  import { UserBaseInfo } from 'src/auth/type/user-base-info.type';
  import { CurrentUser } from 'src/auth/decorator/user.decorator';
  import { CreateClubPayload } from './payload/create-club.payload';
  
  @Controller('clubs')
  @ApiTags('Club API')
  export class ClubController {
    constructor(private readonly clubService: ClubService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '클럽을 생성합니다' })
    @ApiCreatedResponse({ type: ClubDto })
    async createEvent(
      @CurrentUser() user: UserBaseInfo,
      @Body() payload: CreateClubPayload,
    ): Promise<ClubDto> {
      return this.clubService.createClub(user.id, payload);
    }
  }