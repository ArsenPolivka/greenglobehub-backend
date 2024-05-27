import { Module } from '@nestjs/common';
import { GreenAiService } from './green-ai.service';
import { GreenAiController } from './green-ai.controller';

@Module({
  controllers: [GreenAiController],
  providers: [GreenAiService],
})
export class GreenAiModule {}
