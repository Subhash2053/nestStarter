import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UserType } from 'src/modules/users/dto/response/user.response';
import { LoginUserDTO } from './dto/input/login-user.dto';
import {
  ChangePasswordResponse,
  RefreshTokenResponse,
  UserLoginResponse,
} from './dto/response/auth-response';
import { CurrentUser } from '../../decorators/get-user.decorator';

import { UsersService } from 'src/modules/users/users.service';
import { FacebookLoginInput } from './dto/input/facebook-login.input';
import { CreateUserDto } from './dto/input/create-user.dto';
import { ChangePasswordDto } from './dto/input/change-password.dto';
import { JwtUserResponse } from './dto/response/jwt-user-reponse';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  //@UseGuards(LocalAuthGuard)
  @Mutation(() => UserLoginResponse)
  async login(@Args('loginUserDTO') loginUserDTO: LoginUserDTO) {
    return this.authService.login(loginUserDTO);
  }

  @Mutation(() => UserLoginResponse)
  async loginWithFacebook(
    @Args('body') facebookLoginInput: FacebookLoginInput,
  ) {
    return await this.authService.loginWithFacebook(facebookLoginInput);
  }

  @Mutation(() => UserType)
  createUser(@Args('createUserDto') createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ChangePasswordResponse)
  async changePassword(
    @Args('changePasswordDto') changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: JwtUserResponse,
  ) {
    const { userId } = user;
    const status = await this.authService.changePassword(
      changePasswordDto,
      userId,
    );
    return { message: 'PASSWORD CHANGED SUCCESSFULLY', status: status };
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserType)
  async getProfile(@Request() req, @CurrentUser() user: JwtUserResponse) {
    return await this.usersService.findOne({ username: user.username });
  }

  @Mutation(() => RefreshTokenResponse)
  async refreshToken(@Args('refreshToken') refreshToken: string) {
    const status = await this.authService.refreshToken(refreshToken);
    return { message: 'Token refreshed successfully', ...status };
  }
}
