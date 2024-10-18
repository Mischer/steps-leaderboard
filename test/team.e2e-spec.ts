import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { TeamDocument } from '../src/team/schemas/team.model';
import { faker } from '@faker-js/faker';

const teamApiPath = '/teams';

describe('TeamController (e2e)', () => {
	let app: INestApplication;
	let mongoServer: MongoMemoryServer;
	let teamId: string;
	let team: TeamDocument;

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
		// Stop the in-memory MongoDB server
		await mongoose.disconnect();
		await mongoServer.stop();
		await app.close();
	});

	it('POST /teams - should create a new team', async () => {
		const createTeamDto = {
			name: faker.company.name(),
		};

		const response = await request(app.getHttpServer()).post(teamApiPath).send(createTeamDto).expect(201);

		expect(response.body.name).toBe(createTeamDto.name);
		teamId = response.body._id;
		team = response.body as TeamDocument;
	});

	it('GET /teams - should return all teams', async () => {
		const response = await request(app.getHttpServer()).get(teamApiPath).expect(200);

		expect(Array.isArray(response.body)).toBe(true);
		expect(response.body.length).toEqual(1);
		expect(response.body[0]).toEqual(team);
	});

	it('GET /teams/:id - should return a team by ID', async () => {
		const response = await request(app.getHttpServer()).get(`${teamApiPath}/${teamId}`).expect(200);

		expect(response.body._id).toBe(teamId);
		expect(response.body.name).toBe(team.name);
	});

	it('DELETE /teams/:id - should delete the team', async () => {
		await request(app.getHttpServer()).delete(`${teamApiPath}/${teamId}`).expect(200);

		await request(app.getHttpServer()).get(`${teamApiPath}/${teamId}`).expect(404);
	});
});
