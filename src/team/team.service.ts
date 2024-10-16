import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TeamModel, TeamDocument } from './schemas/team.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamRepository } from './team.repository';

@Injectable()
export class TeamService {
	private logger;

	constructor(private readonly teamsRepository: TeamRepository) {
		this.teamsRepository = teamsRepository;
		this.logger = new Logger(TeamService.name);
	}
	async create(createTeamDto: CreateTeamDto): Promise<TeamDocument> {
		const teamModel = new TeamModel(createTeamDto);
		return this.teamsRepository.createOne(teamModel);
	}

	async findAll(): Promise<TeamDocument[]> {
		return this.teamsRepository.findAll(teamModel);
	}

	async findOne(id: string): Promise<TeamDocument> {
		const team = await this.teamsRepository.findById(id);
		if (!team) {
			throw new NotFoundException(`Team with ID "${id}" not found`);
		}
		return team;
	}

	async delete(id: string): Promise<TeamDocument> {
		const team = await this.teamsRepository.delete(id);
		if (!team) {
			throw new NotFoundException(`Team with ID "${id}" not found`);
		}
		return team;
	}
}
