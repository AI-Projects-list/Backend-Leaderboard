import { IsInt, IsPositive, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateScoreDto {
  @IsInt()
  @IsPositive()
  score: number;

  @IsOptional()
  @IsString()
  playerName?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
