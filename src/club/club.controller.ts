import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOperation,
    ApiNoContentResponse,
    ApiTags,
  } from '@nestjs/swagger';
  import { ClubService } from './club.service';
  import {
    Body,
    Controller,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
  } from '@nestjs/common';
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

    @Post(':clubId/join')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '클럽에 가입 신청합니다' })
    @ApiNoContentResponse()
    @HttpCode(204)
    async joinClub(
      @Param('clubId', ParseIntPipe) clubId: number,
      @CurrentUser() user: UserBaseInfo,
    ): Promise<void> {
      return this.clubService.joinClub(clubId, user.id);
    }
  }