import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './configs/swagger.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.setGlobalPrefix(configService.get<string>('GLOBAL_API_PREFIX'));

	// Swagger configuration
	setupSwagger(app);

	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	const port = configService.get<number>('PORT') || process.env.PORT || 3000;
	await app.listen(port);
}
bootstrap();
