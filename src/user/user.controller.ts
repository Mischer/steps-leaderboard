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
import { CreateUserDto } from './dto/create-user.dto';
import { IncrementStepsDto } from './dto/increment-steps.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserDocument } from './schemas/user.model';
import { UserService } from './user.service';
import { MongoExceptionFilter } from '../exception/mongo-exception.filter';

@ApiTags('users')
@Controller('users')
export class UserController {
	constructor(@Inject('UserService') private readonly userService: UserService) {}

	@Post()
	@ApiOperation({ summary: 'Create a user' })
	@UseFilters(MongoExceptionFilter)
	create(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
		return this.userService.create(createUserDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all users' })
	findAll(): Promise<UserDocument[]> {
		return this.userService.findAll();
	}

	@Get('teams/:teamId')
	@ApiOperation({ summary: 'Get all users for a team' })
	findByTeam(@Param('teamId') teamId: string): Promise<UserDocument[]> {
		return this.userService.findByTeam(teamId);
	}

	@Patch(':id/increment')
	@ApiOperation({ summary: 'Increment user steps' })
	increment(@Param('id') id: string, @Body() incrementStepsDto: IncrementStepsDto): Promise<UserDocument> {
		return this.userService.incrementSteps(id, incrementStepsDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a user by ID' })
	async delete(@Param('id') id: string): Promise<UserDocument> | null {
		const user = await this.userService.delete(id);
		if (!user) {
			throw new NotFoundException(`User with ID "${id}" not found`);
		}
		return user;
	}
}
