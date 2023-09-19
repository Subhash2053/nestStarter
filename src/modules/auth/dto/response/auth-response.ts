import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { UserType } from 'src/modules/users/dto/response/user.response';
import { User } from 'src/schemas/user.schema';

@ObjectType()
class AuthResponse {
  @Field({ nullable: true })
  message?: string;
}
@ObjectType()
export class UserLoginResponse extends AuthResponse {
  @Field(() => UserType)
  user: UserType | User;

  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}

@ObjectType()
export class ChangePasswordResponse extends AuthResponse {
  @Field()
  status: boolean;
}

@ObjectType()
export class RefreshTokenResponse extends OmitType(UserLoginResponse, [
  'user',
] as const) {}
