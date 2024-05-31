import { Optional } from '@nestjs/common';
import { IsString, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate: Date;

  @Optional()
  @IsString()
  thumbnail: string;

  @IsString()
  initiativeId: string;
}
