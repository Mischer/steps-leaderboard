import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './configs/swagger.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Swagger configuration
	setupSwagger(app);

	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	await app.listen(3000);
}
bootstrap();
