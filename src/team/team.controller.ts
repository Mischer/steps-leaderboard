import { Controller, Get, Post, Delete, Param, Body, NotFoundException, Inject, UseFilters } from '@nestjs/common';
import { TeamDocument } from './schemas/team.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { MongoExceptionFilter } from '../exception/mongo-exception.filter';
import { TeamTotalStepsResponseDto } from './dto/team-total-steps-response.dto';

@ApiTags('teams')
@Controller('teams')
export class TeamController {
	constructor(@Inject('TeamService') private readonly teamService: TeamService) {}

	@Post()
	@ApiOperation({ summary: 'Create a team' })
	@ApiResponse({ status: 201, description: 'Team created successfully.' })
	@UseFilters(MongoExceptionFilter)
	create(@Body() createTeamDto: CreateTeamDto): Promise<TeamDocument> {
		return this.teamService.create(createTeamDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all teams with their total steps' })
	findAll(): Promise<TeamDocument[]> {
		return this.teamService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a team by ID' })
	async findOne(@Param('id') id: string): Promise<TeamDocument> {
		const team = await this.teamService.findOne(id);
		if (!team) {
			throw new NotFoundException(`Team with ID "${id}" not found`);
		}
		return team;
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a team by ID' })
	async delete(@Param('id') id: string): Promise<TeamDocument> {
		return this.teamService.delete(id);
	}

	@Get(':id/totalSteps')
	@ApiOperation({ summary: 'Get total steps for a team by ID' })
	async getTotalSteps(@Param('id') id: string): Promise<TeamTotalStepsResponseDto> {
		return this.teamService.getTotalSteps(id);
	}
}
