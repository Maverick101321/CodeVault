import { Module } from '@nestjs/common';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FirebaseGuard } from './firebase.guard';

@Module({
  imports: [FirebaseAdminModule, PrismaModule],
  providers: [FirebaseGuard],
  exports: [FirebaseGuard, FirebaseAdminModule],
})
export class AuthModule {}
