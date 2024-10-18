import { Test, TestingModule } from '@nestjs/testing';
import { CounterService } from './counter.service';
import { CounterServiceImpl } from './counter.service.impl';
import { CounterRepository } from './counter.repository';
import { TeamService } from '../team/team.service';
import { CreateCounterDto } from './dto/create-counter.dto';
import { IncrementStepsDto } from './dto/increment-steps.dto';
import { Types } from 'mongoose';
import { CounterDocument } from './schemas/counter.model';
import { faker } from '@faker-js/faker';

describe('CounterService Tests', () => {
	let counterService: CounterService;
	let counterRepository: CounterRepository;
	let teamService: TeamService;

	const mockCounterRepository = {
		createOne: jest.fn(),
		findAll: jest.fn(),
		findById: jest.fn(),
		findByTeam: jest.fn(),
		updateSteps: jest.fn(),
		delete: jest.fn(),
	};

	const mockTeamService = {
		updateTotalSteps: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: 'CounterService',
					useClass: CounterServiceImpl,
				},
				{
					provide: CounterRepository,
					useValue: mockCounterRepository,
				},
				{
					provide: 'TeamService',
					useValue: mockTeamService,
				},
			],
		}).compile();

		counterService = module.get<CounterService>('CounterService');
		counterRepository = module.get<CounterRepository>(CounterRepository);
		teamService = module.get<TeamService>('TeamService');
	});

	afterEach(() => {
		jest.clearAllMocks(); // Clear mock calls after each test
	});

	describe('create', () => {
		it('should create a new counter and update team steps', async () => {
			const createCounterDto: CreateCounterDto = {
				teamId: faker.database.mongodbObjectId(),
				steps: faker.number.int(1000),
			};
			const mockCounter = {
				_id: new Types.ObjectId(),
				team: new Types.ObjectId(createCounterDto.teamId),
				steps: createCounterDto.steps,
			} as CounterDocument;

			mockCounterRepository.createOne.mockResolvedValue(mockCounter);

			const result = await counterService.create(createCounterDto);

			expect(counterRepository.createOne).toHaveBeenCalledWith({
				...createCounterDto,
				team: new Types.ObjectId(createCounterDto.teamId),
			});
			expect(teamService.updateTotalSteps).toHaveBeenCalledWith(
				new Types.ObjectId(createCounterDto.teamId),
				createCounterDto.steps,
			);
			expect(result).toBe(mockCounter);
		});
	});

	describe('findAll', () => {
		it('should return all counters', async () => {
			const mockCounters = [
				{ _id: faker.database.mongodbObjectId(), team: new Types.ObjectId(), steps: faker.number.int(1000) },
				{ _id: faker.database.mongodbObjectId(), team: new Types.ObjectId(), steps: faker.number.int(2000) },
			] as CounterDocument[];

			mockCounterRepository.findAll.mockResolvedValue(mockCounters);

			const result = await counterService.findAll();

			expect(counterRepository.findAll).toHaveBeenCalledTimes(1);
			expect(result).toBe(mockCounters);
		});
	});

	describe('findById', () => {
		it('should find a counter by id', async () => {
			const id = faker.database.mongodbObjectId();
			const mockCounter = { _id: id, team: new Types.ObjectId(), steps: faker.number.int(1000) } as CounterDocument;

			mockCounterRepository.findById.mockResolvedValue(mockCounter);

			const result = await counterService.findById(id);

			expect(counterRepository.findById).toHaveBeenCalledWith(new Types.ObjectId(id));
			expect(result).toBe(mockCounter);
		});
	});

	describe('findByTeam', () => {
		it('should find counters by team id', async () => {
			const teamId = faker.database.mongodbObjectId();
			const mockCounters = [
				{ _id: faker.database.mongodbObjectId(), team: new Types.ObjectId(teamId), steps: faker.number.int(1000) },
				{ _id: faker.database.mongodbObjectId(), team: new Types.ObjectId(teamId), steps: faker.number.int(2000) },
			] as CounterDocument[];

			mockCounterRepository.findByTeam.mockResolvedValue(mockCounters);

			const result = await counterService.findByTeam(teamId);

			expect(counterRepository.findByTeam).toHaveBeenCalledWith(new Types.ObjectId(teamId));
			expect(result).toBe(mockCounters);
		});
	});

	describe('incrementSteps', () => {
		it('should increment steps and update team total steps', async () => {
			const id = faker.database.mongodbObjectId();
			const incrementStepsDto: IncrementStepsDto = { steps: faker.number.int(50) };
			const mockCounter = { _id: id, steps: faker.number.int(100), team: new Types.ObjectId() } as CounterDocument;

			mockCounterRepository.updateSteps.mockResolvedValue(mockCounter);

			const result = await counterService.incrementSteps(id, incrementStepsDto);

			expect(counterRepository.updateSteps).toHaveBeenCalledWith(new Types.ObjectId(id), incrementStepsDto.steps);
			expect(teamService.updateTotalSteps).toHaveBeenCalledWith(mockCounter.team, incrementStepsDto.steps);
			expect(result).toBe(mockCounter);
		});

		it('should return null if counter not found during increment', async () => {
			const id = faker.database.mongodbObjectId();
			const incrementStepsDto: IncrementStepsDto = { steps: faker.number.int(50) };

			mockCounterRepository.updateSteps.mockResolvedValue(null);

			const result = await counterService.incrementSteps(id, incrementStepsDto);

			expect(counterRepository.updateSteps).toHaveBeenCalledWith(new Types.ObjectId(id), incrementStepsDto.steps);
			expect(teamService.updateTotalSteps).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});
	});

	describe('delete', () => {
		it('should delete a counter and update team total steps', async () => {
			const id = faker.database.mongodbObjectId();
			const mockCounter = { _id: id, steps: faker.number.int(100), team: new Types.ObjectId() } as CounterDocument;

			mockCounterRepository.delete.mockResolvedValue(mockCounter);

			const result = await counterService.delete(id);

			expect(counterRepository.delete).toHaveBeenCalledWith(new Types.ObjectId(id));
			expect(teamService.updateTotalSteps).toHaveBeenCalledWith(mockCounter.team, -mockCounter.steps);
			expect(result).toBe(mockCounter);
		});

		it('should return null if counter not found during deletion', async () => {
			const id = faker.database.mongodbObjectId();

			mockCounterRepository.delete.mockResolvedValue(null);

			const result = await counterService.delete(id);

			expect(counterRepository.delete).toHaveBeenCalledWith(new Types.ObjectId(id));
			expect(teamService.updateTotalSteps).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});
	});
});
