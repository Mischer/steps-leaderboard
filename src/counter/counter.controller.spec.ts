import { Test, TestingModule } from '@nestjs/testing';
import { CounterController } from './counter.controller';
import { INestApplication } from '@nestjs/common';
import { CreateCounterDto } from './dto/create-counter.dto';
import { IncrementStepsDto } from './dto/increment-steps.dto';
import * as request from 'supertest';
import { CounterService } from './counter.service';
import { faker } from '@faker-js/faker';

describe('CounterController Tests', () => {
	let app: INestApplication;
	let counterService: CounterService;

	const mockCounterService = {
		create: jest.fn(),
		findAll: jest.fn(),
		findById: jest.fn(),
		findByTeam: jest.fn(),
		incrementSteps: jest.fn(),
		delete: jest.fn(),
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [CounterController],
			providers: [
				{
					provide: 'CounterService',
					useValue: mockCounterService,
				},
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		counterService = app.get<CounterService>('CounterService');
		await app.init();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('/POST counters', () => {
		it('should create a new counter', async () => {
			const id = faker.string.uuid();
			const createCounterDto: CreateCounterDto = { teamId: faker.string.uuid(), steps: faker.number.int(1000) };
			const result = { _id: id, ...createCounterDto };
			mockCounterService.create.mockResolvedValue(result);

			await request(app.getHttpServer()).post('/counters').send(createCounterDto).expect(201).expect(result);
			expect(counterService.create).toHaveBeenCalledWith(createCounterDto);
		});
	});

	describe('/GET counters', () => {
		it('should return an array of counters', async () => {
			const id = faker.string.uuid();
			const counters = [
				{ _id: id, teamId: faker.string.uuid(), steps: faker.number.int(1000) },
				{ _id: id, teamId: faker.string.uuid(), steps: faker.number.int(2000) },
			];
			mockCounterService.findAll.mockResolvedValue(counters);

			await request(app.getHttpServer()).get('/counters').expect(200).expect(counters);
			expect(counterService.findAll).toHaveBeenCalledTimes(1);
		});
	});

	describe('/GET counters/:id', () => {
		it('should return a counter by ID', async () => {
			const id = faker.string.uuid();
			const counter = { _id: id, teamId: faker.string.uuid(), steps: faker.number.int(1000) };
			mockCounterService.findById.mockResolvedValue(counter);

			await request(app.getHttpServer()).get(`/counters/${id}`).expect(200).expect(counter);
			expect(counterService.findById).toHaveBeenCalledWith(id);
		});

		it('should return 404 if counter not found', async () => {
			const id = faker.string.uuid();
			mockCounterService.findById.mockResolvedValue(null);

			await request(app.getHttpServer()).get(`/counters/${id}`).expect(404);
			expect(counterService.findById).toHaveBeenCalledWith(id);
		});
	});

	describe('/GET counters/teams/:teamId', () => {
		it('should return counters for a specific team', async () => {
			const teamId = faker.string.uuid();
			const counters = [
				{ _id: faker.string.uuid(), teamId, steps: faker.number.int(1000) },
				{ _id: faker.string.uuid(), teamId, steps: faker.number.int(2000) },
			];
			mockCounterService.findByTeam.mockResolvedValue(counters);

			await request(app.getHttpServer()).get(`/counters/teams/${teamId}`).expect(200).expect(counters);
			expect(counterService.findByTeam).toHaveBeenCalledWith(teamId);
		});
	});

	describe('/PATCH counters/:id/increment', () => {
		it('should increment the steps of a counter', async () => {
			const id = faker.string.uuid();
			const incrementStepsDto: IncrementStepsDto = { steps: faker.number.int(100) };
			const counter = { _id: id, teamId: faker.string.uuid(), steps: 1000 };
			const updatedCounter = { ...counter, steps: counter.steps + incrementStepsDto.steps };
			mockCounterService.incrementSteps.mockResolvedValue(updatedCounter);

			await request(app.getHttpServer())
				.patch(`/counters/${id}/increment`)
				.send(incrementStepsDto)
				.expect(200)
				.expect(updatedCounter);
			expect(counterService.incrementSteps).toHaveBeenCalledWith(id, incrementStepsDto);
		});

		it('should return 404 if counter to increment not found', async () => {
			const id = faker.string.uuid();
			const incrementStepsDto: IncrementStepsDto = { steps: faker.number.int(100) };
			mockCounterService.incrementSteps.mockResolvedValue(null);

			await request(app.getHttpServer()).patch(`/counters/${id}/increment`).send(incrementStepsDto).expect(404);
			expect(counterService.incrementSteps).toHaveBeenCalledWith(id, incrementStepsDto);
		});
	});

	describe('/DELETE counters/:id', () => {
		it('should delete a counter by ID', async () => {
			const id = faker.string.uuid();
			const counter = { _id: id, teamId: faker.string.uuid(), steps: 1000 };
			mockCounterService.delete.mockResolvedValue(counter);

			await request(app.getHttpServer()).delete(`/counters/${id}`).expect(200).expect(counter);
			expect(counterService.delete).toHaveBeenCalledWith(id);
		});

		it('should return 404 if counter to delete not found', async () => {
			const id = faker.string.uuid();
			mockCounterService.delete.mockResolvedValue(null);

			await request(app.getHttpServer()).delete(`/counters/${id}`).expect(404);
			expect(counterService.delete).toHaveBeenCalledWith(id);
		});
	});
});
