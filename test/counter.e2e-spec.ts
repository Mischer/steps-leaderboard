import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CounterDocument } from '../src/counter/schemas/counter.model';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

const counterApiPath = '/counters';

describe('CounterController (e2e)', () => {
	let app: INestApplication;
	let counterId: string;
	let counter: CounterDocument;
	const teamId = new mongoose.Types.ObjectId();

	let mongoServer: MongoMemoryServer;

	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		const mongoUri = mongoServer.getUri();

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [MongooseModule.forRoot(mongoUri), AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
		await app.close();
	});

	it('POST api/counters - should create a new counter', async () => {
		const createCounterDto = {
			teamId: teamId.toString(),
			steps: 100,
		};

		const response = await request(app.getHttpServer()).post(counterApiPath).send(createCounterDto).expect(201);

		expect(response.body.team).toBe(createCounterDto.teamId);
		expect(response.body.steps).toBe(createCounterDto.steps);
		counterId = response.body._id;
		counter = response.body as CounterDocument;
	});

	it('GET /counters/:id - should return the created counter', async () => {
		const response = await request(app.getHttpServer()).get(`${counterApiPath}/${counterId}`).expect(200);

		expect(response.body._id).toBe(counterId);
		expect(response.body.team).toBe(teamId.toString());
	});

	it('PATCH /counters/:id/increment - should update steps of the counter', async () => {
		const incrementStepsDto = {
			steps: faker.number.int({ min: 1, max: 1000 }),
		};

		const response = await request(app.getHttpServer())
			.patch(`${counterApiPath}/${counterId}/increment`)
			.send(incrementStepsDto)
			.expect(200);

		expect(response.body.steps).toBe(counter.steps + incrementStepsDto.steps);
	});

	it('DELETE /counters/:id - should delete the counter', async () => {
		await request(app.getHttpServer()).delete(`${counterApiPath}/${counterId}`).expect(200);

		await request(app.getHttpServer()).get(`${counterApiPath}/${counterId}`).expect(404);
	});

	it('GET /counters - should return an empty list after deletion', async () => {
		const response = await request(app.getHttpServer()).get(counterApiPath).expect(200);

		expect(Array.isArray(response.body)).toBe(true);
		expect(response.body.length).toBe(0);
	});
});
