import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FcmService } from './fcm.service';
import { Fcm } from './entities/fcm.entity';
import { CreateFcmInput } from './dto/create-fcm.input';
import { UpdateFcmInput } from './dto/update-fcm.input';

@Resolver(() => Fcm)
export class FcmResolver {
  constructor(private readonly fcmService: FcmService) {}

  @Mutation(() => Fcm)
  createFcm(@Args('createFcmInput') createFcmInput: CreateFcmInput) {
    return this.fcmService.create(createFcmInput);
  }

  @Query(() => [Fcm], { name: 'fcm' })
  findAll() {
    return this.fcmService.findAll();
  }

  @Query(() => Fcm, { name: 'fcm' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.fcmService.findOne(id);
  }

  @Mutation(() => Fcm)
  updateFcm(@Args('updateFcmInput') updateFcmInput: UpdateFcmInput) {
    return this.fcmService.update(updateFcmInput.id, updateFcmInput);
  }

  @Mutation(() => Fcm)
  removeFcm(@Args('id', { type: () => Int }) id: number) {
    return this.fcmService.remove(id);
  }
}
