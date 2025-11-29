import { Injectable } from '@nestjs/common';
import { CreateFcmInput } from './dto/create-fcm.input';
import { UpdateFcmInput } from './dto/update-fcm.input';

@Injectable()
export class FcmService {
  create(createFcmInput: CreateFcmInput) {
    return 'This action adds a new fcm';
  }

  findAll() {
    return `This action returns all fcm`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fcm`;
  }

  update(id: number, updateFcmInput: UpdateFcmInput) {
    return `This action updates a #${id} fcm`;
  }

  remove(id: number) {
    return `This action removes a #${id} fcm`;
  }
}
