import { TeamDocument } from './schemas/team.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { Types } from 'mongoose';

export interface TeamService {
	create(createTeamDto: CreateTeamDto): Promise<TeamDocument>;
	findAll(): Promise<TeamDocument[]>;
	findById(id: string): Promise<TeamDocument | null>;
	delete(id: string): Promise<TeamDocument | null>;
	updateTotalSteps(teamId: string | Types.ObjectId, stepsDelta: number): Promise<TeamDocument>;
}
