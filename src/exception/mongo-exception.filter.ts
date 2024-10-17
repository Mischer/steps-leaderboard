import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { MongoServerError } from 'mongodb';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
	catch(exception: MongoServerError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

		if (exception.code === 11000) {
			// code 11000 - duplicate key
			response.status(409).json({
				statusCode: 409,
				message: 'Duplicate key error',
				details: exception.message,
				path: request.url,
			});
		} else {
			response.status(500).json({
				statusCode: 500,
				message: 'Internal server error',
				details: exception.message,
				path: request.url,
			});
		}
	}
}
