import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserType } from 'src/users/dto/response/user.response';
import { LoginUserDTO } from './dto/input/login-user.dto';
import { UserLoginResponse } from './dto/response/auth-response';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  //@UseGuards(LocalAuthGuard)
  @Mutation(() => UserLoginResponse)
  async login(@Args('loginUserDTO') loginUserDTO: LoginUserDTO) {
    return this.authService.login(loginUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserType)
  async getProfile(@Request() req) {
    return req.user;
  }
}
