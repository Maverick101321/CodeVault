import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SnippetsModule } from './snippets/snippets.module';
import { FirebaseAdminModule } from './firebase-admin/firebase-admin.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, SnippetsModule, FirebaseAdminModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
