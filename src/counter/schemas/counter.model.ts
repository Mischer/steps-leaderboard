import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TeamModel } from '../../team/schemas/team.model';

export type CounterDocument = CounterModel & Document;

@Schema({ timestamps: true })
export class CounterModel extends Document {
	@Prop({ type: Number, default: 0 })
	steps: number;

	@Prop({ type: Types.ObjectId, ref: TeamModel.name, required: true })
	team: Types.ObjectId;

	@Prop({ default: Date.now })
	createdAt: Date;
}

export const CounterSchema = SchemaFactory.createForClass(CounterModel);
