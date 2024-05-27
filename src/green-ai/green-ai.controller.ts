import { Controller, Post, Body } from '@nestjs/common';
import { GreenAiService } from './green-ai.service';

@Controller('green-ai')
export class GreenAiController {
  constructor(private readonly greenAiService: GreenAiService) {}

  @Post('generate-text')
  async generateText(@Body('prompt') prompt: string): Promise<string> {
    return this.greenAiService.performTextGeneration(prompt);
  }
}
