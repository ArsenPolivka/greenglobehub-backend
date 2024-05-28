import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { GreenAiModule } from './green-ai/green-ai.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [CategoriesModule, GreenAiModule, AuthModule, ArticlesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
