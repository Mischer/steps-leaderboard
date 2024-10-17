import { IsString, IsNotEmpty, IsMongoId, IsEmail, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty({
		description: 'Email address of the user',
		example: 'user@example.com',
	})
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: 'Password for the user account',
		example: 'securePassword123',
	})
	@IsString()
	@IsNotEmpty()
	password: string;

	@ApiPropertyOptional({
		description: 'Number of steps the user has taken',
		example: 1000,
	})
	@IsNumber()
	@IsOptional()
	steps: number;

	@ApiProperty({
		description: 'ID of the team the user belongs to',
		example: '60f5a4f97c213e6a4b8f1b55',
	})
	@IsMongoId()
	@IsNotEmpty()
	teamId: string;
}
