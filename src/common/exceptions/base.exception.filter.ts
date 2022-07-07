// 处理统一异常
import { FastifyRequest, FastifyReply } from 'fastify'
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, ServiceUnavailableException } from "@nestjs/common";

@Catch()    // 参数为空时，默认捕获所有异常
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    // 非 HTTP 标准异常的处理。
    response.status(HttpStatus.SERVICE_UNAVAILABLE).send({
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: new ServiceUnavailableException().getResponse(),
    });
  }
}