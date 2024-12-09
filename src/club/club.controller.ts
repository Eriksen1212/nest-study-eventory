import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClubService } from './club.service';
import { ClubRepository } from './club.repository';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ClubDto, ClubListDto } from './dto/club.dto';
import { UserBaseInfo } from 'src/auth/type/user-base-info.type';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { CreateClubPayload } from './payload/create-club.payload';
import { UpdateClubPayload } from './payload/update-club.payload';
import { DelegatePayload } from './payload/delegate.payload';
import { ApprovePayload } from './payload/approve.payload';

@Controller('clubs')
@ApiTags('Club API')
export class ClubController {
  constructor(
    private readonly clubService: ClubService,
    private readonly clubRepository: ClubRepository,
  ) {}

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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내가 가입한 클럽 정보를 조회합니다' })
  @ApiOkResponse({ type: ClubListDto })
  async getMyClubs(@CurrentUser() user: UserBaseInfo): Promise<ClubListDto> {
    return this.clubService.getMyClubs(user);
  }

  @Get(':clubId')
  @ApiOperation({ summary: '클럽 정보를 조회합니다' })
  @ApiOkResponse({ type: ClubDto })
  async getClubById(
    @Param('clubId', ParseIntPipe) clubId: number,
  ): Promise<ClubDto> {
    const club = await this.clubService.getClubById(clubId);
    return club;
  }

  @Patch(':clubId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '클럽을 수정합니다.' })
  @ApiOkResponse({ type: ClubDto })
  async patchUpdateEvent(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() payload: UpdateClubPayload,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<ClubDto> {
    return this.clubService.updateClub(clubId, payload, user);
  }

  @Patch(':clubId/delegate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '클럽장을 위임합니다.(클럽장 권한)' })
  @ApiOkResponse({ type: ClubDto })
  async delegate(
    @CurrentUser() user: UserBaseInfo,
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() payload: DelegatePayload,
  ): Promise<ClubDto> {
    return this.clubService.delegate(clubId, user.id, payload);
  }

  @Put(':clubId/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '클럽 가입 신청을 승인합니다.(클럽장 권한)' })
  @HttpCode(204)
  @ApiNoContentResponse()
  async approve(
    @CurrentUser() user: UserBaseInfo,
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() payload: ApprovePayload,
  ): Promise<void> {
    return this.clubService.approve(clubId, user.id, payload);
  }
}
