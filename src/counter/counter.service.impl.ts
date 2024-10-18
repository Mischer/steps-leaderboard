import { Injectable, Logger } from '@nestjs/common';
import { CounterRepository } from './counter.repository';
import { CounterDocument } from './schemas/counter.model';
import { IncrementStepsDto } from './dto/increment-steps.dto';
import { CreateCounterDto } from './dto/create-counter.dto';
import { CounterService } from './counter.service';
import { Types } from 'mongoose';

@Injectable()
export class CounterServiceImpl implements CounterService {
	private logger;
	constructor(private readonly counterRepository: CounterRepository) {
		this.logger = new Logger(CounterServiceImpl.name);
	}

	async create(createCounterDto: CreateCounterDto): Promise<CounterDocument> {
		// FIXME use mapper instead
		const counter = {
			...createCounterDto,
			team: new Types.ObjectId(createCounterDto.teamId),
		};
		return this.counterRepository.createOne(counter);
	}

	findAll(): Promise<CounterDocument[]> {
		return this.counterRepository.findAll();
	}

	async findByTeam(teamId: string): Promise<CounterDocument[]> {
		return this.counterRepository.findByTeam(new Types.ObjectId(teamId));
	}

	async incrementSteps(id: string, incrementStepsDto: IncrementStepsDto): Promise<CounterDocument> {
		const counter = await this.counterRepository.findById(new Types.ObjectId(id));
		if (!counter) {
			return null;
		}

		counter.steps += incrementStepsDto.steps;
		return counter.save();
	}

	async delete(id: string): Promise<CounterDocument> {
		return this.counterRepository.delete(new Types.ObjectId(id));
	}

	async getTotalStepsByTeam(teamId: string): Promise<{ totalSteps: number }> {
		const result = await this.counterRepository.getTotalStepsByTeam(new Types.ObjectId(teamId));
		return { totalSteps: result.length > 0 ? result[0].totalSteps : 0 };
	}
}
