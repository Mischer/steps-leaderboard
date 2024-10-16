import { Controller, Get, Post, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamDocument } from './schemas/team.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('teams')
@Controller('teams')
export class TeamController {
	constructor(private readonly teamsService: TeamService) {}

	@Post()
	@ApiOperation({ summary: 'Create a team' })
	@ApiResponse({ status: 201, description: 'Team created successfully.' })
	create(@Body() createTeamDto: CreateTeamDto): Promise<TeamDocument> {
		return this.teamsService.create(createTeamDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all teams with their total steps' })
	findAll(): Promise<TeamDocument[]> {
		return this.teamsService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a team by ID' })
	async findOne(@Param('id') id: string): Promise<TeamDocument> {
		const team = await this.teamsService.findOne(id);
		if (!team) {
			throw new NotFoundException(`Team with ID "${id}" not found`);
		}
		return team;
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a team by ID' })
	async delete(@Param('id') id: string): Promise<TeamDocument> {
		const team = await this.teamsService.delete(id);
		if (!team) {
			throw new NotFoundException(`Team with ID "${id}" not found`);
		}
		return team;
	}
}
