import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class GreenAiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async performTextGeneration(prompt: string): Promise<any> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Your role is to answer only questions and provide information related to ecology, green energy, recycling, sustainability, environmental conservation, climate change, and related topics. Do not respond to questions outside these domains.",
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "gpt-3.5-turbo",
      });

      if (completion && completion.choices && completion.choices.length > 0) {
        return completion.choices[0];
      } else {
        throw new Error('Unexpected response format from OpenAI API');
      }
    } catch (error) {
      if (error.type === 'insufficient_quota') {
        throw new Error('OpenAI rate limit reached. Please try again later.');
      } else {
        throw new Error('Failed to generate text using OpenAI API');
      }
    }
  }
}
