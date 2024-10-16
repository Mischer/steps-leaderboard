import { IsNumber, IsPositive } from 'class-validator';

export class IncrementStepsDto {
	@IsNumber()
	@IsPositive()
	steps: number;
}
