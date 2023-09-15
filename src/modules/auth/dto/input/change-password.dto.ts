import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

@InputType()
export class ChangePasswordDto {
  @Field()
  @IsNotEmpty()
  oldPassword: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}
