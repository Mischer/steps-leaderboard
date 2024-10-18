import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CounterDocument, CounterModel } from './schemas/counter.model';

@Injectable()
export class CounterRepository {
	constructor(@InjectModel(CounterModel.name) private readonly counterModel: Model<CounterModel>) {}

	async createOne(counter: Partial<CounterDocument>): Promise<CounterDocument> {
		return this.counterModel.create(counter);
	}

	async findAll(): Promise<CounterDocument[]> {
		return this.counterModel.find().populate('team').exec();
	}

	async findById(id: Types.ObjectId): Promise<CounterDocument | null> {
		return this.counterModel.findById(id).exec();
	}

	async findByTeam(teamId: Types.ObjectId): Promise<CounterDocument[]> {
		return this.counterModel.find({ team: teamId }).exec();
	}

	async delete(id: Types.ObjectId): Promise<CounterDocument | null> {
		return this.counterModel.findByIdAndDelete(id).exec();
	}

	async updateSteps(id: Types.ObjectId, stepDifference: number): Promise<CounterDocument | null> {
		return this.counterModel.findByIdAndUpdate(id, {
			$inc: { steps: stepDifference },
		});
	}

	async getTotalStepsByTeam(teamId: Types.ObjectId): Promise<{ totalSteps: number }[]> {
		return this.counterModel.aggregate([
			{ $match: { team: teamId } },
			{ $group: { _id: null, totalSteps: { $sum: '$steps' } } },
		]);
	}
}
