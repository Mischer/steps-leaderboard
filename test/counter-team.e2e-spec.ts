import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

describe('Counter and Team Integration (e2e)', () => {
	let app: INestApplication;
	let mongoServer: MongoMemoryServer;
	let teamId;

	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		const mongoUri = mongoServer.getUri();

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		await mongoose.connect(mongoUri);
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
		await app.close();
	});

	beforeEach(async () => {
		const teamResponse = await request(app.getHttpServer())
			.post('/teams')
			.send({ name: faker.company.name() })
			.expect(201);

		teamId = teamResponse.body._id;
	});

	afterEach(async () => {
		// Clean up the database
		const collections = mongoose.connection.collections;
		for (const key in collections) {
			await collections[key].deleteMany({});
		}
	});

	it('should create a new counter and update team totalSteps', async () => {
		const steps = faker.number.int(500);

		const createCounterResponse = await request(app.getHttpServer())
			.post('/counters')
			.send({ teamId, steps })
			.expect(201);

		expect(createCounterResponse.body.steps).toBe(steps);

		const updatedTeamResponse = await request(app.getHttpServer()).get(`/teams/${teamId}`).expect(200);
		expect(updatedTeamResponse.body.totalSteps).toBe(steps);
	});

	it('should update a counter and update team totalSteps', async () => {
		const initialSteps = faker.number.int(300);
		const updatedSteps = faker.number.int(700);

		const createCounterResponse = await request(app.getHttpServer())
			.post('/counters')
			.send({ teamId, steps: initialSteps })
			.expect(201);

		const counterId = createCounterResponse.body._id;

		await request(app.getHttpServer())
			.patch(`/counters/${counterId}/increment`)
			.send({ steps: updatedSteps })
			.expect(200);

		const updatedTeamResponse = await request(app.getHttpServer()).get(`/teams/${teamId}`).expect(200);
		expect(updatedTeamResponse.body.totalSteps).toBe(initialSteps + updatedSteps);
	});

	it('should delete a counter and update team totalSteps', async () => {
		const steps = faker.number.int(400);

		const createCounterResponse = await request(app.getHttpServer())
			.post('/counters')
			.send({ teamId, steps })
			.expect(201);

		const counterId = createCounterResponse.body._id;

		let teamResponseAfterCreate = await request(app.getHttpServer()).get(`/teams/${teamId}`).expect(200);
		expect(teamResponseAfterCreate.body.totalSteps).toBe(steps);

		await request(app.getHttpServer()).delete(`/counters/${counterId}`).expect(200);

		teamResponseAfterCreate = await request(app.getHttpServer()).get(`/teams/${teamId}`).expect(200);
		expect(teamResponseAfterCreate.body.totalSteps).toBe(0);
	});
});
