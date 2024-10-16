import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TeamModel, TeamDocument } from './schemas/team.model';

@Injectable()
export class TeamRepository {
	constructor(@InjectModel(TeamModel.name) private readonly teamModel: Model<TeamModel>) {}

	async createOne(team: Partial<TeamDocument>): Promise<TeamDocument> {
		return this.teamModel.create(team);
	}

	async findAll(): Promise<TeamDocument[]> {
		return this.teamModel.find().exec();
	}

	async findById(id: Types.ObjectId): Promise<TeamDocument | null> {
		return this.teamModel.findById(id).exec();
	}

	async delete(id: Types.ObjectId): Promise<TeamDocument | null> {
		return this.teamModel.findByIdAndDelete(id).exec();
	}

	async updateTotalSteps(id: Types.ObjectId, stepDifference: number): Promise<TeamDocument> {
		return this.teamModel.findByIdAndUpdate(id, {
			$inc: { totalSteps: stepDifference },
		});
	}
}
