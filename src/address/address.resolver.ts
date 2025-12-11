import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { CurrentUser } from 'src/core/helper/decorators/current.user';
import { User } from 'src/user/entities/user.entity';
import { PaginatedAddress } from './entities/paginated.address';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/core/helper/decorators/role.mata.decorator';
import { RoleEnum } from 'src/core/enums/role.enum';

@Resolver(() => Address)
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @Mutation(() => Address)
  createAddress(
    @Args('createAddressInput') createAddressInput: CreateAddressInput,
  ) {
    return this.addressService.create(createAddressInput);
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedAddress, { name: 'getAllUserAddresses' })
  findAll(
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate: PaginationInput,
    @CurrentUser() user: User,
  ) {
    console.log('Current User:', user);
    return this.addressService.findAll(paginate, user);
  }
  @Roles(RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Query(() => PaginatedAddress, { name: 'getAllAddressesBoard' })
  findAllBoard(
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate: PaginationInput,
    @CurrentUser() user: User,
  ) {
    console.log('Current User:', user);
    return this.addressService.findAll(paginate, user);
  }

  @Query(() => Address, { name: 'address' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.addressService.findOne(id);
  }

  @Mutation(() => Address)
  updateAddress(
    @Args('updateAddressInput') updateAddressInput: UpdateAddressInput,
  ) {
    return this.addressService.update(
      updateAddressInput.id,
      updateAddressInput,
    );
  }

  @Mutation(() => Address)
  removeAddress(@Args('id', { type: () => String }) id: string) {
    return this.addressService.remove(id);
  }
}
