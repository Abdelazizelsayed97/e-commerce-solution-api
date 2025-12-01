import { Injectable } from '@nestjs/common';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';
import { cond } from 'lodash';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}
  async create(createVendorInput: CreateVendorInput) {
    const isExist = await this.vendorRepository.findOne({
      where: {
        user: {
          id: createVendorInput.user_id,
        },
      },
    });

    if (isExist) {
      throw new Error('vendor already exist');
    }
    const user = await this.userService.findOne(createVendorInput.user_id);
    if (!user) {
      throw new Error('user not found');
    }
    const vendor = this.vendorRepository.create({
      ...createVendorInput,
      user: user,
    });

    return await this.vendorRepository.save(vendor);
  }

  async getAllVendors() {
    const vendors = await this.vendorRepository.find({
      relations: {
        user: true,
      },
    });
    return vendors;
  }

  async findOne(id: string) {
    const vendor = await this.vendorRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });
    if (!vendor) {
      throw new Error('vendor not found');
    }
    return vendor;
  }

  async update(id: string, updateVendorInput: UpdateVendorInput) {
    const isExist = await this.findOne(id);
    if (!isExist) {
      throw new Error('vendor not found');
    }
    Object.assign(isExist, updateVendorInput);
    return this.vendorRepository.save(isExist);
  }

  async remove(id: number) {
    await this.vendorRepository.delete(id);
    return {
      success: true,
      message: `This action removes a #${id} vendor`,
    };
  }
}
