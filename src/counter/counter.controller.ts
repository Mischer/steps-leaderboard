import {
	Controller,
	Get,
	Post,
	Delete,
	Param,
	Body,
	Patch,
	Inject,
	NotFoundException,
	UseFilters,
	InternalServerErrorException,
} from '@nestjs/common';
import { CreateCounterDto } from './dto/create-counter.dto';
import { IncrementStepsDto } from './dto/increment-steps.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CounterDocument } from './schemas/counter.model';
import { CounterService } from './counter.service';
import { MongoExceptionFilter } from '../exception/mongo-exception.filter';
import { COUNTER_NOT_FOUND_ERROR } from './countert.constants';

@ApiTags('counters')
@Controller('counters')
export class CounterController {
	constructor(@Inject('CounterService') private readonly counterService: CounterService) {}

	@Post()
	@ApiOperation({ summary: 'Create a counter' })
	@UseFilters(MongoExceptionFilter)
	async create(@Body() createCounterDto: CreateCounterDto): Promise<CounterDocument> {
		const counter = await this.counterService.create(createCounterDto);
		if (!counter) {
			throw new InternalServerErrorException();
		}
		return counter;
	}

	@Get()
	@ApiOperation({ summary: 'Get all counters' })
	findAll(): Promise<CounterDocument[]> {
		return this.counterService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a counter by ID' })
	async findById(@Param('id') id: string): Promise<CounterDocument> {
		const counter = await this.counterService.findById(id);
		if (!counter) {
			throw new NotFoundException(COUNTER_NOT_FOUND_ERROR);
		}
		return counter;
	}

	@Get('teams/:teamId')
	@ApiOperation({ summary: 'Get all counters for a team' })
	findByTeam(@Param('teamId') teamId: string): Promise<CounterDocument[]> {
		return this.counterService.findByTeam(teamId);
	}

	@Patch(':id/increment')
	@ApiOperation({ summary: 'Increment counter steps' })
	async increment(@Param('id') id: string, @Body() incrementStepsDto: IncrementStepsDto): Promise<CounterDocument> {
		const counter = await this.counterService.incrementSteps(id, incrementStepsDto);
		if (!counter) {
			throw new NotFoundException(COUNTER_NOT_FOUND_ERROR);
		}
		return counter;
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a counter by ID' })
	async delete(@Param('id') id: string): Promise<CounterDocument> {
		const counter = await this.counterService.delete(id);
		if (!counter) {
			throw new NotFoundException(COUNTER_NOT_FOUND_ERROR);
		}
		return counter;
	}
}
