import { TeamDocument } from './schemas/team.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamTotalStepsResponseDto } from './dto/team-total-steps-response.dto';
import { Types } from 'mongoose';

export interface TeamService {
	create(createTeamDto: CreateTeamDto): Promise<TeamDocument>;
	findAll(): Promise<TeamDocument[]>;
	findOne(id: string): Promise<TeamDocument>;
	delete(id: string): Promise<TeamDocument>;
	updateTotalSteps(teamId: string | Types.ObjectId, stepsDelta: number): Promise<TeamDocument>;
	getTotalSteps(teamId: string): Promise<TeamTotalStepsResponseDto>;
}
