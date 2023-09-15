import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/modules/users/hash.service';
import { UsersService } from 'src/modules/users/users.service';
import { LoginUserDTO } from './dto/input/login-user.dto';
import { UserLoginResponse } from './dto/response/auth-response';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && this.hashService.comparePassword(pass, user.password)) {
      // const { ...result } = user;
      return user;
    }
    return null;
  }

  async login(loginUserDTO: LoginUserDTO): Promise<UserLoginResponse> {
    const { username, password } = loginUserDTO;

    const user = await this.validateUser(username, password);
    if (!user) {
      throw new BadRequestException('Wrong Credentials');
    }
    const payload = { username: username, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
      refreshToken: this.jwtService.sign(payload),
    };
  }
}
