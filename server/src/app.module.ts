import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SnippetsModule } from './snippets/snippets.module';

@Module({
  imports: [PrismaModule, SnippetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
