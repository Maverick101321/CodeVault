import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private admin: admin.app.App;

  onModuleInit() {
    const serviceAccountPath = path.join(
      process.cwd(),
      'firebase-service-account.json',
    );
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(serviceAccountPath, 'utf8'),
      );
      this.admin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      console.error(
        'Firebase service account file not found at',
        serviceAccountPath,
      );
    }
  }

  getFirebaseAdmin() {
    return this.admin;
  }
}
