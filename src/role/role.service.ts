import { Injectable } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleInput: CreateRoleInput) {
    const isExist = await this.rolesRepository.findOne({
      where: {
        name: createRoleInput.name,
      },
    });
    if (isExist) {
      throw new Error('role already exist');
    }
    const role = this.rolesRepository.create(createRoleInput);
    return await this.rolesRepository.save(role);
  }

  async findAll() {
    return await this.rolesRepository.find();
  }

  async findOne(id: string) {
    return `This action returns a #${id} role`;
  }
  async findByName(name: string) {
    const isExist = await this.rolesRepository.findOne({
      where: {
        name,
      },
    });
    if (!isExist) {
      throw new Error('role not found');
    }
    return isExist;
  }
  update(id: number, updateRoleInput: UpdateRoleInput) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
