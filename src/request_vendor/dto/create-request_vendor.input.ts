import { InputType, PartialType } from '@nestjs/graphql';
import { CreateVendorInput } from 'src/vendor/dto/create-vendor.input';

@InputType()
export class CreateRequestVendorInput extends PartialType(CreateVendorInput) {}
