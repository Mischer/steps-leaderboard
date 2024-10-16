import { Test, TestingModule } from '@nestjs/testing';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { INestApplication } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import * as request from 'supertest';

describe('TeamController Tests', () => {
	let app: INestApplication;
	const mockTeamService = {
		create: jest.fn(),
		findAll: jest.fn(),
		findOne: jest.fn(),
		delete: jest.fn(),
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [TeamController],
			providers: [
				{
					provide: TeamService,
					useValue: mockTeamService,
				},
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('/POST teams', () => {
		it('should create a new team', () => {
			const createTeamDto: CreateTeamDto = { name: 'Team A' };
			mockTeamService.create.mockResolvedValue({ id: '1', ...createTeamDto });

			return request(app.getHttpServer()).post('/teams').send(createTeamDto).expect(201).expect({
				id: '1',
				name: 'Team A',
			});
		});
	});

	describe('/GET teams', () => {
		it('should return an array of teams', () => {
			const teams = [
				{ id: '1', name: 'Team A' },
				{ id: '2', name: 'Team B' },
			];
			mockTeamService.findAll.mockResolvedValue(teams);

			return request(app.getHttpServer()).get('/teams').expect(200).expect(teams);
		});
	});

	describe('/GET teams/:id', () => {
		it('should return a team by ID', () => {
			const team = { id: '1', name: 'Team A' };
			mockTeamService.findOne.mockResolvedValue(team);

			return request(app.getHttpServer()).get('/teams/1').expect(200).expect(team);
		});

		it('should return 404 if team not found', () => {
			mockTeamService.findOne.mockResolvedValue(null);

			return request(app.getHttpServer()).get('/teams/99').expect(404);
		});
	});

	describe('/DELETE teams/:id', () => {
		it('should delete a team by ID', () => {
			const team = { id: '1', name: 'Team A' };
			mockTeamService.delete.mockResolvedValue(team);

			return request(app.getHttpServer()).delete('/teams/1').expect(200).expect(team);
		});

		it('should return 404 if team to delete not found', () => {
			mockTeamService.delete.mockResolvedValue(null);

			return request(app.getHttpServer()).delete('/teams/99').expect(404);
		});
	});
});
