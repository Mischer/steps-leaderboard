import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CounterRepository } from './counter.repository';
import { CounterDocument } from './schemas/counter.model';
import { IncrementStepsDto } from './dto/increment-steps.dto';
import { CreateCounterDto } from './dto/create-counter.dto';
import { CounterService } from './counter.service';
import { Types } from 'mongoose';
import { TeamService } from '../team/team.service';

@Injectable()
export class CounterServiceImpl implements CounterService {
	private logger;
	constructor(
		private readonly counterRepository: CounterRepository,
		@Inject(forwardRef(() => 'TeamService'))
		private readonly teamService: TeamService,
	) {
		this.logger = new Logger(CounterServiceImpl.name);
	}

	async create(createCounterDto: CreateCounterDto): Promise<CounterDocument | null> {
		// FIXME use mapper instead
		const counter = {
			...createCounterDto,
			team: new Types.ObjectId(createCounterDto.teamId),
		};
		const counterModel = await this.counterRepository.createOne(counter);

		await this.teamService.updateTotalSteps(counter.team, createCounterDto.steps);
		return counterModel;
	}

	findAll(): Promise<CounterDocument[]> {
		return this.counterRepository.findAll();
	}

	async findById(id: string): Promise<CounterDocument | null> {
		return this.counterRepository.findById(new Types.ObjectId(id));
	}

	async findByTeam(teamId: string): Promise<CounterDocument[]> {
		return this.counterRepository.findByTeam(new Types.ObjectId(teamId));
	}

	async incrementSteps(id: string, incrementStepsDto: IncrementStepsDto): Promise<CounterDocument> {
		const counter = await this.counterRepository.updateSteps(new Types.ObjectId(id), incrementStepsDto.steps);
		if (!counter) {
			return null;
		}

		await this.teamService.updateTotalSteps(counter.team, incrementStepsDto.steps);
		return counter;
	}

	async delete(id: string): Promise<CounterDocument | null> {
		const counter = await this.counterRepository.delete(new Types.ObjectId(id));
		if (!counter) {
			return null;
		}

		await this.teamService.updateTotalSteps(counter.team, -counter.steps);
		return counter;
	}
}
