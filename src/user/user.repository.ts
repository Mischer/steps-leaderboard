import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument, UserModel } from './schemas/user.model';

@Injectable()
export class UserRepository {
	constructor(@InjectModel(UserModel.name) private readonly userModel: Model<UserModel>) {}

	async createOne(user: Partial<UserDocument>): Promise<UserDocument> {
		return this.userModel.create(user);
	}

	async findAll(): Promise<UserDocument[]> {
		return this.userModel.find().populate('team').exec();
	}

	async findById(id: Types.ObjectId): Promise<UserDocument> {
		return this.userModel.findById(id).exec();
	}

	async findByTeam(teamId: Types.ObjectId): Promise<UserDocument[]> {
		return this.userModel.find({ team: teamId }).exec();
	}

	async delete(id: Types.ObjectId): Promise<UserDocument> {
		return this.userModel.findByIdAndDelete(id).exec();
	}

	async getTotalStepsByTeam(teamId: Types.ObjectId): Promise<{ totalSteps: number }[]> {
		return this.userModel.aggregate([
			{ $match: { team: teamId } },
			{ $group: { _id: null, totalSteps: { $sum: '$steps' } } },
		]);
	}
}
