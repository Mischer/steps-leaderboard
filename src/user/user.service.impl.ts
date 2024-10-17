import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDocument } from './schemas/user.model';
import { IncrementStepsDto } from './dto/increment-steps.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { genSalt, hash } from 'bcryptjs';
import { Types } from 'mongoose';

@Injectable()
export class UserServiceImpl implements UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async create(createUserDto: CreateUserDto): Promise<UserDocument> {
		// FIXME use mapper instead
		const user = {
			...createUserDto,
			password: await hash(createUserDto.password, await genSalt(10)),
			team: new Types.ObjectId(createUserDto.teamId),
		};
		return this.userRepository.createOne(user);
	}

	findAll(): Promise<UserDocument[]> {
		return this.userRepository.findAll();
	}

	async findByTeam(teamId: string): Promise<UserDocument[]> {
		return this.userRepository.findByTeam(new Types.ObjectId(teamId));
	}

	async incrementSteps(id: string, incrementStepsDto: IncrementStepsDto): Promise<UserDocument> {
		const user = await this.userRepository.findById(new Types.ObjectId(id));
		if (!user) {
			throw new NotFoundException(`User with ID "${id}" not found`);
		}
		user.steps += incrementStepsDto.steps;
		return user.save();
	}

	delete(id: string): Promise<UserDocument> | null {
		return this.userRepository.delete(new Types.ObjectId(id));
	}
}
