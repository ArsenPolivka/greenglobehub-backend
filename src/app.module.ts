import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { GreenAiModule } from './green-ai/green-ai.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { InitiativesModule } from './initiatives/initiatives.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [CategoriesModule, GreenAiModule, AuthModule, ArticlesModule, InitiativesModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
