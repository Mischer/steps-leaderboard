import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserServiceImpl } from './user.service.impl';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './schemas/user.model';
import { UserRepository } from './user.repository';
import { TeamModel, TeamSchema } from '../team/schemas/team.model';

@Module({
	controllers: [UserController],
	imports: [
		MongooseModule.forFeature([
			{ name: UserModel.name, schema: UserSchema },
			{ name: TeamModel.name, schema: TeamSchema },
		]),
	],
	providers: [
		UserRepository, // Separate DB layer
		{
			provide: 'UserService',
			useClass: UserServiceImpl,
		},
	],
})
export class UserModule {}
