import { Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserType } from './dto/response/user.response';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private userService: UsersService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Query(() => [UserType])
  getUsers() {
    return this.userService.findAll();
  }
}
