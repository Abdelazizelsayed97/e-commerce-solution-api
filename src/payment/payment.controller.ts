import {
  Controller,
  Post,
  Headers,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { RefundReason } from 'src/core/enums/refund.reason.enum';
import { User } from 'src/user/entities/user.entity';

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
  async handleRefund(@Req() req, orderID: string, reason: RefundReason) {
    const rawBody = req.body;
    const sig = req.headers['stripe-signature'];

    try {
      await this.paymentService.processRefund(orderID, reason);
      return { received: true };
    } catch (error) {
      throw new BadRequestException(`Return error: ${error.message}`);
    }
  }
}
