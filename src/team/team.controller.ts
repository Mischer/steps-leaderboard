import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { TeamService } from './team.service';
import { Team } from './schemas/team.schema';
import { CreateTeamDto } from './dto/create-team.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('teams')
@Controller('teams')
export class TeamController {
	constructor(private readonly teamsService: TeamService) {}

	@Post()
	@ApiOperation({ summary: 'Create a team' })
	@ApiResponse({ status: 201, description: 'Team created successfully.' })
	create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
		return this.teamsService.create(createTeamDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all teams with their total steps' })
	findAll(): Promise<Team[]> {
		return this.teamsService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a team by ID' })
	findOne(@Param('id') id: string): Promise<Team> {
		return this.teamsService.findOne(id);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a team by ID' })
	delete(@Param('id') id: string): Promise<Team> {
		return this.teamsService.delete(id);
	}
}
