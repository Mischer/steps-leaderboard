import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber } from 'class-validator';

export class TeamTotalStepsResponseDto {
	@ApiProperty({
		description: 'The current team id',
		example: '60f5a4f97c213e6a4b8f1b55',
	})
	@IsMongoId()
	teamId: string;

	@ApiProperty({
		description: 'The total steps of the team members',
		example: 2500,
	})
	@IsNumber()
	totalSteps: number;
}
