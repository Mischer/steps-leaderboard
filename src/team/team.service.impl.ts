import { Injectable, Logger } from '@nestjs/common';
import { TeamDocument } from './schemas/team.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';
import { Types } from 'mongoose';

@Injectable()
export class TeamServiceImpl implements TeamService {
	private logger;

	constructor(private readonly teamsRepository: TeamRepository) {
		this.teamsRepository = teamsRepository;
		this.logger = new Logger(TeamServiceImpl.name);
	}
	async create(createTeamDto: CreateTeamDto): Promise<TeamDocument> {
		// FIXME use mapper instead
		const mappedModel = {
			...createTeamDto,
		};

		return this.teamsRepository.createOne(mappedModel);
	}

	async findAll(): Promise<TeamDocument[]> {
		return this.teamsRepository.findAll();
	}

	async findOne(id: string): Promise<TeamDocument> {
		return this.teamsRepository.findById(new Types.ObjectId(id));
	}

	async delete(id: string): Promise<TeamDocument> {
		return this.teamsRepository.delete(new Types.ObjectId(id));
	}
}
