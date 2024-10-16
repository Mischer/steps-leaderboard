import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserServiceImpl } from './user.service.impl';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './schemas/user.model';
import { UserRepository } from './user.repository';

@Module({
	controllers: [UserController],
	imports: [MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }])],
	providers: [
		UserRepository, // Separate DB layer
		{
			provide: 'UserService',
			useClass: UserServiceImpl,
		},
	],
})
export class UserModule {}
