import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../entities/user.entity';

@Injectable()
export class ScoreOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const body = request.body;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admins can submit scores for anyone
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Regular users can only submit scores for themselves
    // If userId is provided in the body, it must match the authenticated user
    if (body.userId && body.userId !== user.id) {
      throw new ForbiddenException('You can only submit scores for yourself');
    }

    // If playerName is provided, ensure it matches the user's username
    if (body.playerName && body.playerName !== user.username) {
      throw new ForbiddenException('Player name must match your username');
    }

    return true;
  }
}
