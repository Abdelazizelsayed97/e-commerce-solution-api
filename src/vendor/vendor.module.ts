import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorResolver } from './vendor.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { RatingAndReview } from 'src/rating-and-review/entities/rating-and-review.entity';
import { VendorLoader } from './loaders/vendor.loader';
import { Vendor } from './entities/vendor.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [VendorResolver, VendorService, VendorLoader],
  exports: [VendorService],
  imports: [
    TypeOrmModule.forFeature([Vendor, RatingAndReview]),
    UserModule,
    EmailModule,
  ],
})
export class VendorModule {}
