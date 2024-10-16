import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './configs/mongo.config';
import { TeamModule } from './team/team.module';
import { CounterModule } from './counter/counter.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getMongoConfig,
			inject: [ConfigService],
		}),
		TeamModule,
		CounterModule,
	],
	controllers: [],
	providers: [],
	exports: [ConfigModule],
})
export class AppModule {}
