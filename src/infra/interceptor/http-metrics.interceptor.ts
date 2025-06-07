import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { metrics } from '@opentelemetry/api';
import { Request, Response } from 'express';

const meter = metrics.getMeter(process.env.APP_NAME ?? 'api-short-url');
const requestCounter = meter.createCounter('http_requests_total', {
  description: 'Total number of HTTP requests',
});

const requestDuration = meter.createHistogram('http_request_duration_ms', {
  description: 'HTTP request duration in milliseconds',
});

interface CustomRequest extends Request {
  route: {
    path?: string;
  };
}

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<CustomRequest>();
    const res = http.getResponse<Response>();

    const startTime = Date.now();
    const method = req.method;
    const route = req.route?.path || req.url;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        requestCounter.add(1, {
          route,
          method,
          status_code: statusCode.toString(),
        });

        requestDuration.record(duration, {
          route,
          method,
          status: statusCode < 400 ? 'success' : 'error',
        });
      }),
      catchError((err) => {
        const statusCode = res.statusCode || 500;
        requestCounter.add(1, {
          route,
          method,
          status_code: statusCode.toString(),
        });
        throw err;
      }),
    );
  }
}
