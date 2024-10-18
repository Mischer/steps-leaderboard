import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamController } from './team.controller';
import { TeamModel, TeamSchema } from './schemas/team.model';
import { TeamServiceImpl } from './team.service.impl';
import { TeamRepository } from './team.repository';
import { CounterModule } from '../counter/counter.module';

@Module({
	controllers: [TeamController],
	imports: [MongooseModule.forFeature([{ name: TeamModel.name, schema: TeamSchema }]), CounterModule],
	providers: [
		TeamRepository, // Separate DB layer
		{
			provide: 'TeamService',
			useClass: TeamServiceImpl,
		},
	],
	exports: ['TeamService'],
})
export class TeamModule {}
