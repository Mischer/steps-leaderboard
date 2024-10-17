import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TeamDocument } from './schemas/team.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';
import { Types } from 'mongoose';
import { UserService } from '../user/user.service';
import { TeamTotalStepsResponseDto } from './dto/team-total-steps-response.dto';

@Injectable()
export class TeamServiceImpl implements TeamService {
	private logger;

	constructor(
		@Inject('UserService') private readonly userService: UserService,
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

	async findOne(id: string): Promise<TeamDocument> {
		return this.teamsRepository.findById(new Types.ObjectId(id));
	}

	async delete(id: string): Promise<TeamDocument> {
		return this.teamsRepository.delete(new Types.ObjectId(id));
	}

	async getTotalSteps(teamId: string): Promise<TeamTotalStepsResponseDto> {
		const team = await this.findOne(teamId);
		if (!team) {
			throw new NotFoundException(`Team with id ${teamId} not found`);
		}

		const result = await this.userService.getTotalStepsByTeam(teamId);
		return {
			teamId,
			...result,
		};
	}
}
