import { Injectable } from "@nestjs/common";

import sgMail from "@sendgrid/mail";

@Injectable()
export class SendGridService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }
  async send(
    mail: sgMail.MailDataRequired
  ): Promise<[sgMail.ClientResponse, {}]> {
    try {
      return await sgMail.send(mail);
    } catch (e) {
      throw new Error(e);
    }
  }
}
