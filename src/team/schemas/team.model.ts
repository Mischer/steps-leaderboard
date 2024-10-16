import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamDocument = TeamModel & Document;

@Schema({ timestamps: true })
export class TeamModel extends Document {
	@Prop({ required: true, unique: true })
	name: string;

	@Prop({ default: Date.now })
	createdAt: Date;
}

export const TeamSchema = SchemaFactory.createForClass(TeamModel);
