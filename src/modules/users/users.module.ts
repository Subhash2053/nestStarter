import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserResolver } from './users.resolver';
import { HashService } from './hash.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessContorlService } from 'src/shared/access-control.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
  ],
  providers: [
    UserResolver,
    UsersService,
    HashService,
    ConfigService,
    AccessContorlService,
  ],
  exports: [UsersModule],
})
export class UsersModule {}
