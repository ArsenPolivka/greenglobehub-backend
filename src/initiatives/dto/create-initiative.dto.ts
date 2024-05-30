import { IsNotEmpty, IsString, IsArray, IsOptional, IsDate } from 'class-validator';

export class CreateInitiativeDto {
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  donateUrl: string;

  @IsString()
  @IsOptional()
  website: string;

  @IsArray()
  @IsOptional()
  members: string[];

  @IsArray()
  @IsOptional()
  posts: string[];

  @IsArray()
  @IsOptional()
  events: string[];

  @IsDate()
  @IsOptional()
  updatedAt: Date;
}
