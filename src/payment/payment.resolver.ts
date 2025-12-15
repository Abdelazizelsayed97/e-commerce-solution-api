import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { CurrentUser } from 'src/core/helper/decorators/current.user';
import { User } from 'src/user/entities/user.entity';
import { RefundReason } from 'src/core/enums/refund.reason.enum';

@Resolver()
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  @Mutation(() => String)
  async refund(
    @Args('orderID') orderID: string,
    @CurrentUser() user: User,
    @Args('reason', { type: () => RefundReason }) reason: RefundReason,
  ) {
    await this.paymentService.createRefundRequest(orderID, reason, user);
    return 'Refund request submitted successfully';
  }
}
