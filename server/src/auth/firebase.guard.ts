import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FirebaseGuard implements CanActivate {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const idToken = authHeader.split(' ')[1];

    try {
      const admin = this.firebaseAdminService.getFirebaseAdmin();
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      const { uid, email } = decodedToken;

      let user = await this.prisma.user.findUnique({
        where: { clerkId: uid },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            clerkId: uid,
            email: email,
          },
        });
      }

      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase ID token');
    }
  }
}
