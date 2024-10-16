import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Swagger configuration
	const config = new DocumentBuilder()
		.setTitle('Steps Leaderboard API')
		.setDescription('API for managing teams and step counters')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('explore', app, document);

	await app.listen(3000);
}
bootstrap();
