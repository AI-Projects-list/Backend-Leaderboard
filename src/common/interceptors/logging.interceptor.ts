import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const { statusCode } = response;
          const contentLength = response.get('content-length');
          const duration = Date.now() - startTime;

          this.logger.log(
            `${ip} - ${method} ${originalUrl} ${statusCode} ${contentLength || 0}b - ${duration}ms - ${userAgent}`,
          );
        },
        error: (error) => {
          const statusCode = error.status || 500;
          const duration = Date.now() - startTime;

          this.logger.error(
            `${ip} - ${method} ${originalUrl} ${statusCode} - ${duration}ms - ${userAgent} - ${error.message}`,
          );
        },
      }),
    );
  }
}
