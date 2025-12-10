import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { Score } from '../entities/score.entity';
import { User, UserRole } from '../entities/user.entity';
import { CreateScoreDto } from './dto';

describe('ScoresService', () => {
  let service: ScoresService;
  let scoreRepository: Repository<Score>;
  let userRepository: Repository<User>;

  const mockScoreRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'testuser',
    password: 'hashedPassword',
    role: UserRole.USER,
    isActive: true,
    scores: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAdmin: User = {
    ...mockUser,
    id: '123e4567-e89b-12d3-a456-426614174001',
    username: 'admin',
    role: UserRole.ADMIN,
  };

  const mockScore: Score = {
    id: '223e4567-e89b-12d3-a456-426614174000',
    score: 1000,
    userId: mockUser.id,
    user: mockUser,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoresService,
        {
          provide: getRepositoryToken(Score),
          useValue: mockScoreRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<ScoresService>(ScoresService);
    scoreRepository = module.get<Repository<Score>>(getRepositoryToken(Score));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createScore', () => {
    const createScoreDto: CreateScoreDto = {
      score: 1000,
    };

    it('should create a score for the current user', async () => {
      mockScoreRepository.create.mockReturnValue(mockScore);
      mockScoreRepository.save.mockResolvedValue(mockScore);

      const result = await service.createScore(createScoreDto, mockUser);

      expect(result).toEqual(mockScore);
      expect(mockScoreRepository.create).toHaveBeenCalledWith({
        score: createScoreDto.score,
        userId: mockUser.id,
      });
      expect(mockScoreRepository.save).toHaveBeenCalledWith(mockScore);
    });

    it('should allow admin to create score for another user by userId', async () => {
      const createScoreDtoWithUserId: CreateScoreDto = {
        score: 1000,
        userId: mockUser.id,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockScoreRepository.create.mockReturnValue(mockScore);
      mockScoreRepository.save.mockResolvedValue(mockScore);

      const result = await service.createScore(createScoreDtoWithUserId, mockAdmin);

      expect(result).toEqual(mockScore);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });

    it('should allow admin to create score for another user by playerName', async () => {
      const createScoreDtoWithPlayerName: CreateScoreDto = {
        score: 1000,
        playerName: mockUser.username,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockScoreRepository.create.mockReturnValue(mockScore);
      mockScoreRepository.save.mockResolvedValue(mockScore);

      const result = await service.createScore(createScoreDtoWithPlayerName, mockAdmin);

      expect(result).toEqual(mockScore);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: mockUser.username },
      });
    });

    it('should throw NotFoundException when admin provides non-existent userId', async () => {
      const createScoreDtoWithUserId: CreateScoreDto = {
        score: 1000,
        userId: 'non-existent-id',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createScore(createScoreDtoWithUserId, mockAdmin),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when admin provides non-existent playerName', async () => {
      const createScoreDtoWithPlayerName: CreateScoreDto = {
        score: 1000,
        playerName: 'nonexistent',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createScore(createScoreDtoWithPlayerName, mockAdmin),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getLeaderboard', () => {
    it('should return top 10 scores by default', async () => {
      const mockLeaderboardData = [
        { playerName: 'player1', score: '1000', achievedAt: new Date() },
        { playerName: 'player2', score: '900', achievedAt: new Date() },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockLeaderboardData),
      };

      mockScoreRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getLeaderboard();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('rank', 1);
      expect(result[0]).toHaveProperty('playerName', 'player1');
      expect(result[0]).toHaveProperty('score', 1000);
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
    });

    it('should return custom number of scores when limit is provided', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };

      mockScoreRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.getLeaderboard(5);

      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);
    });
  });

  describe('getUserScores', () => {
    it('should return user scores ordered by score descending', async () => {
      const mockScores = [mockScore];
      mockScoreRepository.find.mockResolvedValue(mockScores);

      const result = await service.getUserScores(mockUser.id);

      expect(result).toEqual(mockScores);
      expect(mockScoreRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        order: { score: 'DESC', createdAt: 'DESC' },
        take: 10,
      });
    });
  });

  describe('getHighScore', () => {
    it('should return the highest score for a user', async () => {
      mockScoreRepository.findOne.mockResolvedValue(mockScore);

      const result = await service.getHighScore(mockUser.id);

      expect(result).toEqual(mockScore);
      expect(mockScoreRepository.findOne).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        order: { score: 'DESC' },
      });
    });

    it('should return null if user has no scores', async () => {
      mockScoreRepository.findOne.mockResolvedValue(null);

      const result = await service.getHighScore(mockUser.id);

      expect(result).toBeNull();
    });
  });
});
