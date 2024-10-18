import { Module } from '@nestjs/common';
import { CounterController } from './counter.controller';
import { CounterServiceImpl } from './counter.service.impl';
import { MongooseModule } from '@nestjs/mongoose';
import { CounterModel, CounterSchema } from './schemas/counter.model';
import { CounterRepository } from './counter.repository';
import { TeamModel, TeamSchema } from '../team/schemas/team.model';

@Module({
	controllers: [CounterController],
	imports: [
		MongooseModule.forFeature([
			{ name: CounterModel.name, schema: CounterSchema },
			{ name: TeamModel.name, schema: TeamSchema },
		]),
	],
	providers: [
		CounterRepository, // Separate DB layer
		{
			provide: 'CounterService',
			useClass: CounterServiceImpl,
		},
	],
	exports: ['CounterService'],
})
export class CounterModule {}
