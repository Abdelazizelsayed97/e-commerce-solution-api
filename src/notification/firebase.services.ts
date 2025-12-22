

import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';


@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    const serviceAccount = require('../../firebase-service-account.json') as ServiceAccount;
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }
  async sendNotification(tokens: string[], title: string, body: string) {
    const message = {
      notification: { title, body },
      tokens,
    };
    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      return { success: true, response };
    } catch (error) {
      return { success: false, error };
    }
  }
}