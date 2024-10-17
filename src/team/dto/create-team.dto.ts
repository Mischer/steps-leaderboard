import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
	@ApiProperty({
		description: 'Name of the team',
		example: 'Team A',
	})
	@IsString()
	@IsNotEmpty()
	name: string;
}
