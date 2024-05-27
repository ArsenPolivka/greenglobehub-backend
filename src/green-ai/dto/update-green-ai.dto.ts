import { PartialType } from '@nestjs/mapped-types';
import { CreateGreenAiDto } from './create-green-ai.dto';

export class UpdateGreenAiDto extends PartialType(CreateGreenAiDto) {}
