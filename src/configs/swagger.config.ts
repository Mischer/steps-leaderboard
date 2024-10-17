import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Sets up Swagger documentation for the NestJS application.
 *
 * This function configures Swagger for the given NestJS application
 * using the provided configuration service to retrieve the Swagger API
 * metadata such as title, description, and version. The Swagger UI is
 * then mounted at the '/explore' endpoint.
 *
 * @param {INestApplication} app - The NestJS application instance.
 */
export const setupSwagger = function (app: INestApplication) {
	const configService = app.get(ConfigService);

	const config = new DocumentBuilder()
		.setTitle(configService.get<string>('SWAGGER_API_TITLE'))
		.setDescription(configService.get<string>('SWAGGER_API_DESCRIPTION'))
		.setVersion(configService.get<string>('SWAGGER_API_VERSION'))
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('explore', app, document);
};
