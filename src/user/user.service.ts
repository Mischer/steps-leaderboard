import { UserDocument } from './schemas/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { IncrementStepsDto } from './dto/increment-steps.dto';

export interface UserService {
	create(createUserDto: CreateUserDto): Promise<UserDocument>;
	findAll(): Promise<UserDocument[]>;
	findByTeam(teamId: string): Promise<UserDocument[]>;
	incrementSteps(id: string, incrementStepsDto: IncrementStepsDto): Promise<UserDocument>;
	delete(id: string): Promise<UserDocument> | null;
	getTotalStepsByTeam(teamId: string): Promise<{ totalSteps: number }>;
}
