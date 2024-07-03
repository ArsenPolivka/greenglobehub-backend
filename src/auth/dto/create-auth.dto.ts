import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(8)
  readonly password: string;

  @IsString()
  @MinLength(8)
  readonly confirmPassword: string;
}
