import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamModel, TeamDocument } from './schemas/team.model';

@Injectable()
export class TeamRepository {
	constructor(@InjectModel(TeamModel.name) private readonly teamModel: Model<TeamDocument>) {}

	async createOne(team: Partial<TeamDocument>): Promise<TeamDocument> {
		return this.tradeModel.save(team);
	}

	async findAll(): Promise<TeamDocument[]> {
		return this.teamModel.find().exec();
	}

	async findById(id: string): Promise<TeamDocument> {
		return this.teamModel.findById(id).exec();
	}

	async delete(id: string): Promise<TeamDocument> {
		return this.teamModel.findByIdAndDelete(id).exec();
	}
}
