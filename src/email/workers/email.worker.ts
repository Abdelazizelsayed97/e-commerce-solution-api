import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { OnModuleInit } from '@nestjs/common';

import { Job } from 'bullmq';

import * as fs from 'fs';
import * as path from 'path';
import { SendGridService } from '../sendgrid.services';

@Processor('email', {
  runRetryDelay: 1000,
})
export class EmailWorker extends WorkerHost implements OnModuleInit {
  constructor(private readonly sendGridService: SendGridService) {
    super();
  }
  onModuleInit() {
    console.log('✅ EmailWorker initialized and ready to process jobs');
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'verification':
        return await this.processVerification(job);
      case 'statusNotification':
        return await this.processStatusNotification(job);
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }

  async processVerification(job: Job<any, any, string>): Promise<any> {
    const { data } = job;
    const templatePath = path.join(
      __dirname,
      '../../core/templates',
      'verification.temp.html',
    );
    let html = fs.readFileSync(templatePath, 'utf8');

    html = html
      .replace('{{username}}', data.user.name)
      .replace('{{verificationCode}}', data.code)
      .replace(
        '{{verificationLink}}',
        `https://yourapp.com/verify?code=${data.code}`,
      )
      .replace('{{year}}', new Date().getFullYear().toString())
      .replace('{{appName}}', 'AirportApp');

    await this.sendGridService.send({
      to: data.user.email,
      subject: 'Verify your email address',
      html,
      from: 'kareem.alsayed009@gmail.com',
    });

    return { success: true };
  }

  async processStatusNotification(job: Job<any, any, string>): Promise<any> {
    const { data } = job;
    const templatePath = path.join(
      __dirname,
      '../../core/templates',
      'notification.temp.html',
    );
    let html = fs.readFileSync(templatePath, 'utf8');

    html = html
      .replace('{{flightName}}', data.user.name)
      .replace('{{flightStatus}}', data.entityName)
      .replace('{{oldStatus}}', data.oldStatus)
      .replace('{{newStatus}}', data.newStatus)
      .replace(
        '{{detailsLink}}',
        `https://${process.env.APP_NAME}.com/${data.entityName}`,
      )
      .replace('{{year}}', new Date().getFullYear().toString())
      .replace('{{appName}}', 'AirportApp');

    await this.sendGridService.send({
      to: data.user.email,
      from: process.env.SENDGRID_SENDER_EMAIL!,
      subject: `${data.entityName} Status Updated`,
      html,
    });

    return { success: true };
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(`Job ${job.id} failed with reason: ${err.message}`);
  }

  @OnWorkerEvent('error')
  onError(err: Error) {
    console.error('EmailWorker error:', err);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} completed successfully.`);
  }
  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    console.log(`Job ${job.id} is processing...`);
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Job ${job.id} is active`);
  }
}
