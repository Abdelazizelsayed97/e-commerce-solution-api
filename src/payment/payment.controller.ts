import {
  Controller,
  Post,
  Headers,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.body;
    try {
      await this.paymentService.verifyAndHandleWebhook(rawBody, signature);
      return { received: true };
    } catch (error) {
      throw new BadRequestException(`Webhook error: ${error.message}`);
    }
  }
  @Post('refund')
  async handleRefund(@Req() req) {
    const rawBody = req.body;
    const sig = req.headers['stripe-signature'];

    try {
      await this.paymentService.handleRefundTransactions(rawBody, sig);
      return { received: true };
    } catch (error) {
      throw new BadRequestException(`Return error: ${error.message}`);
    }
  }
}
