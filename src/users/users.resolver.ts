import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/input/create-user.dto';
import { UserType } from './dto/response/user.response';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [UserType])
  getUsers() {
    return this.userService.findAll();
  }

  @Mutation(() => UserType)
  createUser(@Args('createUserDto') createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
