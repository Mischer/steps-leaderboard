import { Injectable, Logger } from '@nestjs/common';
import { TeamModel, TeamDocument } from './schemas/team.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';

@Injectable()
export class TeamServiceImpl implements TeamService {
	private logger;

	constructor(private readonly teamsRepository: TeamRepository) {
		this.teamsRepository = teamsRepository;
		this.logger = new Logger(TeamServiceImpl.name);
	}
	async create(createTeamDto: CreateTeamDto): Promise<TeamDocument> {
		const teamModel = new TeamModel(createTeamDto);
		return this.teamsRepository.createOne(teamModel);
	}

	async findAll(): Promise<TeamDocument[]> {
		return this.teamsRepository.findAll();
	}

	async findOne(id: string): Promise<TeamDocument> {
		return this.teamsRepository.findById(id);
	}

	async delete(id: string): Promise<TeamDocument> {
		return this.teamsRepository.delete(id);
	}
}
