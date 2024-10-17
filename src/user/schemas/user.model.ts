import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TeamModel } from '../../team/schemas/team.model';

export type UserDocument = UserModel & Document;

@Schema({ timestamps: true })
export class UserModel extends Document {
	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ type: Number, default: 0 })
	steps: number;

	@Prop({ type: Types.ObjectId, ref: TeamModel.name, required: true })
	team: Types.ObjectId;

	@Prop({ default: Date.now })
	createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
