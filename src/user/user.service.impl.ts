import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDocument, UserModel } from './schemas/user.model';
import { IncrementStepsDto } from './dto/increment-steps.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserServiceImpl implements UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async create(createUserDto: CreateUserDto): Promise<UserDocument> {
		const user = new UserModel({
			...createUserDto,
			passwordHash: await hash(createUserDto.password, await genSalt(10)),
		});
		return this.userRepository.createOne(user);
	}

	findAll(): Promise<UserDocument[]> {
		return this.userRepository.findAll();
	}

	async findByTeam(teamId: string): Promise<UserDocument[]> {
		return this.userRepository.findByTeam(teamId);
	}

	async incrementSteps(id: string, incrementStepsDto: IncrementStepsDto): Promise<UserDocument> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new NotFoundException(`User with ID "${id}" not found`);
		}
		user.steps += incrementStepsDto.steps;
		return user.save();
	}

	delete(id: string): Promise<UserDocument> {
		return this.userRepository.delete(id);
	}
}
