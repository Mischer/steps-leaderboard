import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamController } from './team.controller';
import { TeamModel, TeamSchema } from './schemas/team.model';
import { TeamService } from './team.service';

@Module({
	controllers: [TeamController],
	imports: [MongooseModule.forFeature([{ name: TeamModel.name, schema: TeamSchema }])],
	providers: [TeamService],
	exports: [TeamsService],
})
export class TeamModule {}
