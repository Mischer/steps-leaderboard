import { Inject, Injectable, Logger } from '@nestjs/common';
import { TeamDocument } from './schemas/team.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';
import { Types } from 'mongoose';
import { CounterService } from '../counter/counter.service';

@Injectable()
export class TeamServiceImpl implements TeamService {
	private logger;

	constructor(
		@Inject('CounterService') private readonly counterService: CounterService,
		private readonly teamsRepository: TeamRepository,
	) {
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

	async findById(id: string): Promise<TeamDocument | null> {
		return this.teamsRepository.findById(new Types.ObjectId(id));
	}

	async delete(id: string): Promise<TeamDocument | null> {
		return this.teamsRepository.delete(new Types.ObjectId(id));
	}

	async updateTotalSteps(id: string | Types.ObjectId, stepsDelta: number): Promise<TeamDocument> {
		return this.teamsRepository.updateTotalSteps(new Types.ObjectId(id), stepsDelta);
	}
}
