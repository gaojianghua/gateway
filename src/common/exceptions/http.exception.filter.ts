// 处理HTTP类型的接口相关异常
import { FastifyRequest, FastifyReply } from 'fastify'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { BusinessException } from "./business.exception";

@Catch(HttpException)   // 参数为 HttpException 将只捕获 HTTP 相关的异常错误
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest<FastifyRequest>();
        const status = exception.getStatus();

        // 处理业务异常
        if (exception instanceof BusinessException) {
            const error = exception.getResponse();
            console.log(error)
            response.status(HttpStatus.OK).send({
                data: null,
                status: error['code'],
                extra: {},
                message: error['message'],
                success: false,
            });
            return;
        }
        response.status(status).send({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.getResponse(),
        });
    }
}