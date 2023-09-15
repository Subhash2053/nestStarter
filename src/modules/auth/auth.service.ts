import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/modules/users/hash.service';
import { UsersService } from 'src/modules/users/users.service';
import { LoginUserDTO } from './dto/input/login-user.dto';
import { UserLoginResponse } from './dto/response/auth-response';
import { FacebookLoginInput } from './dto/input/facebook-login.input';
import { ChangePasswordDto } from './dto/input/change-password.dto';
import { ConfigService } from '@nestjs/config';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({
      username: username,
    });
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
      accessToken: await this.jwtService.sign(payload),
      user: user,
      refreshToken: await this.jwtService.sign(payload, {
        expiresIn: '2d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      }),
    };
  }

  async loginWithFacebook(facebookLoginInput: FacebookLoginInput) {
    return facebookLoginInput;
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    const { oldPassword, password } = changePasswordDto;

    try {
      const user = await this.usersService.findById(userId);

      if (!user) {
        throw new BadRequestException('Something is wrong');
      }

      const isValidPass = await this.hashService.comparePassword(
        oldPassword,
        user.password,
      );

      if (!isValidPass) {
        throw new BadRequestException('wrong password');
      }

      const hash = await this.hashService.hashPassword(password);
      await this.usersService.updateById(userId, {
        password: hash,
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new BadRequestException('Refresh token is required');
      }
      const decoded = await this.decodeRefreshToken(refreshToken);
      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('UNAUTHORIZED_USER');
      }

      // Remove access token and refresh token
      const user = await this.usersService.findOne({
        _id: decoded.sub,
      });
      if (!user) {
        throw new ForbiddenException('UNAUTHORIZED_USER');
      }

      const refreshTokenPayload = { username: user.username, sub: user._id };
      const accessToken = await this.jwtService.sign(refreshTokenPayload);
      const newRefreshToken = await this.jwtService.sign(refreshTokenPayload, {
        expiresIn: '2d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error: any) {
      throw error;
    }
  }

  private async decodeRefreshToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      } else {
        throw new UnauthorizedException('Refresh token malformed');
      }
    }
  }
}
