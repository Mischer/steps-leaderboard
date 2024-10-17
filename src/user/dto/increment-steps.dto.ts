import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IncrementStepsDto {
	@ApiProperty({ description: 'Number of steps to increment', example: 100 })
	@IsNumber()
	@IsPositive()
	steps: number;
}
