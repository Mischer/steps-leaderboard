import { Test, TestingModule } from '@nestjs/testing';
import { CounterServiceImpl } from './counter.service.impl';

describe('CounterService', () => {
	let service: CounterServiceImpl;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CounterServiceImpl],
		}).compile();

		service = module.get<CounterServiceImpl>(CounterServiceImpl);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
