import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from '../auth/dto/input/create-user.dto';
import { HashService } from './hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, username, password, role } = createUserDto;
    const user = await this.userModel.findOne({ username: username });

    if (user) {
      throw new BadRequestException('Username already Exist');
    }
    const createdUser = new this.userModel({
      firstName,
      lastName,
      username,
      password: await this.hashService.hashPassword(password),
      role,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOne(condition, projection = null) {
    if (projection) {
      return this.userModel.findOne(condition, projection);
    } else {
      return this.userModel.findOne(condition);
    }
  }

  async findById(id: string, projection = {}) {
    return this.userModel.findById(id, projection);
  }

  async updateById(id: string, data, options = {}) {
    return this.userModel.findByIdAndUpdate(id, data, options);
  }
}
