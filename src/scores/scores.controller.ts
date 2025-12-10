import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ScoreOwnershipGuard } from './guards/score-ownership.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller()
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post('scores')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, ScoreOwnershipGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per 60 seconds
  async submitScore(@Body() createScoreDto: CreateScoreDto, @CurrentUser() user: User) {
    const score = await this.scoresService.createScore(createScoreDto, user);
    return {
      message: 'Score submitted successfully',
      score: {
        id: score.id,
        score: score.score,
        createdAt: score.createdAt,
      },
    };
  }

  @Get('leaderboard')
  @HttpCode(HttpStatus.OK)
  async getLeaderboard(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const leaderboard = await this.scoresService.getLeaderboard(limit || 10);
    return {
      message: 'Leaderboard retrieved successfully',
      leaderboard,
    };
  }

  @Get('scores/me')
  @UseGuards(JwtAuthGuard)
  async getMyScores(@CurrentUser() user: User) {
    const scores = await this.scoresService.getUserScores(user.id);
    return {
      message: 'Your scores retrieved successfully',
      scores,
    };
  }

  @Get('scores/me/best')
  @UseGuards(JwtAuthGuard)
  async getMyBestScore(@CurrentUser() user: User) {
    const score = await this.scoresService.getHighScore(user.id);
    return {
      message: 'Your best score retrieved successfully',
      score,
    };
  }
}
