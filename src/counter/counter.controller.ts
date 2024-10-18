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
} from '@nestjs/common';
import { CreateCounterDto } from './dto/create-counter.dto';
import { IncrementStepsDto } from './dto/increment-steps.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CounterDocument } from './schemas/counter.model';
import { CounterService } from './counter.service';
import { MongoExceptionFilter } from '../exception/mongo-exception.filter';

@ApiTags('counters')
@Controller('counters')
export class CounterController {
	constructor(@Inject('CounterService') private readonly counterService: CounterService) {}

	@Post()
	@ApiOperation({ summary: 'Create a counter' })
	@UseFilters(MongoExceptionFilter)
	create(@Body() createCounterDto: CreateCounterDto): Promise<CounterDocument> {
		return this.counterService.create(createCounterDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all counters' })
	findAll(): Promise<CounterDocument[]> {
		return this.counterService.findAll();
	}

	@Get('teams/:teamId')
	@ApiOperation({ summary: 'Get all counters for a team' })
	findByTeam(@Param('teamId') teamId: string): Promise<CounterDocument[]> {
		return this.counterService.findByTeam(teamId);
	}

	@Patch(':id/increment')
	@ApiOperation({ summary: 'Increment counter steps' })
	increment(@Param('id') id: string, @Body() incrementStepsDto: IncrementStepsDto): Promise<CounterDocument> {
		return this.counterService.incrementSteps(id, incrementStepsDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a counter by ID' })
	async delete(@Param('id') id: string): Promise<CounterDocument> | null {
		const counter = await this.counterService.delete(id);
		if (!counter) {
			throw new NotFoundException(`Counter with ID "${id}" not found`);
		}
		return counter;
	}
}
