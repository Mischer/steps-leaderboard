import { IsNotEmpty, IsMongoId, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCounterDto {
	@ApiPropertyOptional({
		description: 'Number of steps of this counter',
		example: 1000,
	})
	@IsNumber()
	@IsOptional()
	steps: number;

	@ApiProperty({
		description: 'ID of the team the counter belongs to',
		example: '60f5a4f97c213e6a4b8f1b55',
	})
	@IsMongoId()
	@IsNotEmpty()
	teamId: string;
}
