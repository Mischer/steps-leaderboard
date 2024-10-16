import { TeamDocument } from './schemas/team.model';
import { CreateTeamDto } from './dto/create-team.dto';

export interface TeamService {
	create(createTeamDto: CreateTeamDto): Promise<TeamDocument>;
	findAll(): Promise<TeamDocument[]>;
	findOne(id: string): Promise<TeamDocument>;
	delete(id: string): Promise<TeamDocument>;
}
