import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../entities/score.entity';
import { User, UserRole } from '../entities/user.entity';
import { CreateScoreDto } from './dto';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createScore(createScoreDto: CreateScoreDto, currentUser: User): Promise<Score> {
    let userId = currentUser.id;

    // If admin provides a userId, use that instead
    if (currentUser.role === UserRole.ADMIN && createScoreDto.userId) {
      const targetUser = await this.userRepository.findOne({
        where: { id: createScoreDto.userId },
      });

      if (!targetUser) {
        throw new NotFoundException('Target user not found');
      }

      userId = targetUser.id;
    }

    // If admin provides a playerName, find the user by username
    if (currentUser.role === UserRole.ADMIN && createScoreDto.playerName) {
      const targetUser = await this.userRepository.findOne({
        where: { username: createScoreDto.playerName },
      });

      if (!targetUser) {
        throw new NotFoundException('Player not found');
      }

      userId = targetUser.id;
    }

    const score = this.scoreRepository.create({
      score: createScoreDto.score,
      userId,
    });

    return this.scoreRepository.save(score);
  }

  async getLeaderboard(limit: number = 10): Promise<any[]> {
    const scores = await this.scoreRepository
      .createQueryBuilder('score')
      .leftJoinAndSelect('score.user', 'user')
      .select([
        'user.username as playerName',
        'MAX(score.score) as score',
        'MAX(score.createdAt) as achievedAt',
      ])
      .groupBy('user.id')
      .addGroupBy('user.username')
      .orderBy('score', 'DESC')
      .limit(limit)
      .getRawMany();

    return scores.map((entry, index) => ({
      rank: index + 1,
      playerName: entry.playerName,
      score: parseInt(entry.score, 10),
      achievedAt: entry.achievedAt,
    }));
  }

  async getUserScores(userId: string): Promise<Score[]> {
    return this.scoreRepository.find({
      where: { userId },
      order: { score: 'DESC', createdAt: 'DESC' },
      take: 10,
    });
  }

  async getHighScore(userId: string): Promise<Score | null> {
    return this.scoreRepository.findOne({
      where: { userId },
      order: { score: 'DESC' },
    });
  }
}
