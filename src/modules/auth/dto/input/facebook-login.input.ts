import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class FacebookLoginInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
