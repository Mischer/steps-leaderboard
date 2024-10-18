import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { TeamServiceImpl } from './team.service.impl';
import { TeamRepository } from './team.repository';
import { CreateTeamDto } from './dto/create-team.dto';
import { Types } from 'mongoose';
import { TeamDocument } from './schemas/team.model';
import { faker } from '@faker-js/faker';

describe('TeamService Tests', () => {
	let teamService: TeamService;
	let teamRepository: TeamRepository;

	const mockTeamRepository = {
		createOne: jest.fn(),
		findAll: jest.fn(),
		findById: jest.fn(),
		updateTotalSteps: jest.fn(),
		delete: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: 'TeamService',
					useClass: TeamServiceImpl,
				},
				{
					provide: TeamRepository,
					useValue: mockTeamRepository,
				},
			],
		}).compile();

		teamService = module.get<TeamService>('TeamService');
		teamRepository = module.get<TeamRepository>(TeamRepository);
	});

	afterEach(() => {
		jest.clearAllMocks(); // Clear mock calls after each test
	});

	describe('create', () => {
		it('should create a new team', async () => {
			const createTeamDto: CreateTeamDto = {
				name: faker.company.name(),
			};
			const mockTeam = {
				_id: faker.database.mongodbObjectId(),
				...createTeamDto,
			} as TeamDocument;

			mockTeamRepository.createOne.mockResolvedValue(mockTeam);

			const result = await teamService.create(createTeamDto);

			expect(teamRepository.createOne).toHaveBeenCalledWith(createTeamDto);
			expect(result).toBe(mockTeam);
		});
	});

	describe('findAll', () => {
		it('should return all teams', async () => {
			const mockTeams = [
				{ _id: faker.database.mongodbObjectId(), name: faker.company.name() },
				{ _id: faker.database.mongodbObjectId(), name: faker.company.name() },
			] as TeamDocument[];

			mockTeamRepository.findAll.mockResolvedValue(mockTeams);

			const result = await teamService.findAll();

			expect(teamRepository.findAll).toHaveBeenCalledTimes(1);
			expect(result).toBe(mockTeams);
		});
	});

	describe('findById', () => {
		it('should find a team by id', async () => {
			const id = faker.database.mongodbObjectId();
			const mockTeam = { _id: id, name: faker.company.name() } as TeamDocument;

			mockTeamRepository.findById.mockResolvedValue(mockTeam);

			const result = await teamService.findById(id);

			expect(teamRepository.findById).toHaveBeenCalledWith(new Types.ObjectId(id));
			expect(result).toBe(mockTeam);
		});

		it('should return null if team not found by id', async () => {
			const id = faker.database.mongodbObjectId();

			mockTeamRepository.findById.mockResolvedValue(null);

			const result = await teamService.findById(id);

			expect(teamRepository.findById).toHaveBeenCalledWith(new Types.ObjectId(id));
			expect(result).toBeNull();
		});
	});

	describe('updateTotalSteps', () => {
		it('should update total steps for a team', async () => {
			const id = faker.database.mongodbObjectId();
			const stepsDelta = faker.number.int(1000);
			const mockTeam = { _id: id, name: faker.company.name(), totalSteps: stepsDelta } as TeamDocument;

			mockTeamRepository.updateTotalSteps.mockResolvedValue(mockTeam);

			const result = await teamService.updateTotalSteps(id, stepsDelta);

			expect(teamRepository.updateTotalSteps).toHaveBeenCalledWith(new Types.ObjectId(id), stepsDelta);
			expect(result).toBe(mockTeam);
		});
	});

	describe('delete', () => {
		it('should delete a team by id', async () => {
			const id = faker.database.mongodbObjectId();
			const mockTeam = { _id: id, name: faker.company.name() } as TeamDocument;

			mockTeamRepository.delete.mockResolvedValue(mockTeam);

			const result = await teamService.delete(id);

			expect(teamRepository.delete).toHaveBeenCalledWith(new Types.ObjectId(id));
			expect(result).toBe(mockTeam);
		});

		it('should return null if team not found during deletion', async () => {
			const id = faker.database.mongodbObjectId();

			mockTeamRepository.delete.mockResolvedValue(null);

			const result = await teamService.delete(id);

			expect(teamRepository.delete).toHaveBeenCalledWith(new Types.ObjectId(id));
			expect(result).toBeNull();
		});
	});
});
