import { IsString, IsNotEmpty, IsMongoId, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsNumber()
	@IsOptional()
	steps: number;

	@IsMongoId()
	@IsNotEmpty()
	team: string;
}
