import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/users/dto/response/user.response';

@ObjectType()
export class UserLoginResponse {
  @Field(() => UserType)
  user: UserType;

  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}

@ObjectType()
export class ChangePasswordResponse {
  @Field()
  status: boolean;
}
