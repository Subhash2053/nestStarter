import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/input/create-user.dto';
import { HashService } from './hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, username, password } = createUserDto;
    const user = await this.userModel.findOne({ username: username });

    if (user) {
      throw new BadRequestException('Username already Exist');
    }
    const createdUser = new this.userModel({
      firstName,
      lastName,
      username,
      password: await this.hashService.hashPassword(password),
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOne(username: string): Promise<User | undefined> {
    return await this.userModel.findOne({ username: username });
  }
}
