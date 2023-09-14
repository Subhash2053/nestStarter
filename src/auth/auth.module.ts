import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HashService } from 'src/users/hash.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '600s' },
        };
      },
    }),
  ],
  providers: [
    ConfigService,
    HashService,
    UsersService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AuthResolver,
  ],
})
export class AuthModule {}
