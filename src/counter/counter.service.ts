import { CounterDocument } from './schemas/counter.model';
import { CreateCounterDto } from './dto/create-counter.dto';
import { IncrementStepsDto } from './dto/increment-steps.dto';

export interface CounterService {
	create(createCounterDto: CreateCounterDto): Promise<CounterDocument>;
	findAll(): Promise<CounterDocument[]>;
	findByTeam(teamId: string): Promise<CounterDocument[]>;
	findById(id: string): Promise<CounterDocument>;
	incrementSteps(id: string, incrementStepsDto: IncrementStepsDto): Promise<CounterDocument>;
	delete(id: string): Promise<CounterDocument | null>;
}
