import { Test, TestingModule } from '@nestjs/testing';
import { TeamController } from './team.controller';
import { INestApplication } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import * as request from 'supertest';
import { TeamService } from './team.service';
import { faker } from '@faker-js/faker';

describe('TeamController Tests', () => {
	let app: INestApplication;
	let teamService: TeamService;

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
					provide: 'TeamService',
					useValue: mockTeamService,
				},
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		teamService = app.get<TeamService>('TeamService');
		await app.init();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('/POST teams', () => {
		it('should create a new team', async () => {
			const id = faker.string.uuid();
			const createTeamDto: CreateTeamDto = { name: faker.company.name() };
			const result = { id, ...createTeamDto };
			mockTeamService.create.mockResolvedValue(result);

			await request(app.getHttpServer()).post('/teams').send(createTeamDto).expect(201).expect(result);
			expect(teamService.create).toHaveBeenCalledWith(createTeamDto);
		});
	});

	describe('/GET teams', () => {
		it('should return an array of teams', async () => {
			const id = faker.string.uuid();
			const teams = [
				{ id, name: faker.company.name() },
				{ id, name: faker.company.name() },
			];
			mockTeamService.findAll.mockResolvedValue(teams);

			await request(app.getHttpServer()).get('/teams').expect(200).expect(teams);
			expect(teamService.findAll).toHaveBeenCalledTimes(1);
		});
	});

	describe('/GET teams/:id', () => {
		it('should return a team by ID', async () => {
			const id = faker.string.uuid();
			const team = { id, name: faker.company.name() };
			mockTeamService.findOne.mockResolvedValue(team);

			await request(app.getHttpServer()).get(`/teams/${id}`).expect(200).expect(team);
			expect(teamService.findOne).toHaveBeenCalledWith(id);
		});

		it('should return 404 if team not found', async () => {
			const id = faker.string.uuid();
			mockTeamService.findOne.mockResolvedValue(null);

			await request(app.getHttpServer()).get(`/teams/${id}`).expect(404);
			expect(teamService.findOne).toHaveBeenCalledWith(id);
		});
	});

	describe('/DELETE teams/:id', () => {
		it('should delete a team by ID', async () => {
			const id = faker.string.uuid();
			const team = { id, name: faker.company.name() };
			mockTeamService.delete.mockResolvedValue(team);

			await request(app.getHttpServer()).delete(`/teams/${id}`).expect(200).expect(team);
			expect(teamService.delete).toHaveBeenCalledWith(id);
		});

		it('should return 404 if team to delete not found', async () => {
			const id = faker.string.uuid();
			mockTeamService.delete.mockResolvedValue(null);

			await request(app.getHttpServer()).delete(`/teams/${id}`).expect(404);
			expect(teamService.delete).toHaveBeenCalledWith(id);
		});
	});
});
