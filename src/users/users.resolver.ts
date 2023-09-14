import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/input/create-user.dto';
import { UserType } from './dto/response/user.response';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private userService: UsersService) {}

  @Query(() => [UserType])
  getUsers() {
    return this.userService.findAll();
  }

  @Mutation(() => UserType)
  createUser(@Args('createUserDto') createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
