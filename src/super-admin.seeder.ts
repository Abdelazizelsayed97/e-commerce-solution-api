import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { RoleEnum } from 'src/core/enums/role.enum';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SuperAdminSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,

    @Inject() private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.seed();
    console.log('super admin initalized');
  }

  async seed() {
    const adminUser = await this.userRepository.findOne({
      where: { email: 'super-admin@app.com' },
    });

    if (!adminUser) {
      const hashedPassword = hashSync('SuperAdmin123!', 10);
      const token = this.jwtService.sign({ id: 'super-admin@app.com' });
      const admin = this.userRepository.create({
        email: 'super-admin@app.com',
        name: 'Super Admin',
        password: hashedPassword,
        role: RoleEnum.superAdmin,
        token: token,
      });
      await this.userRepository.save(admin);
      console.log('Super admin user created');
    }
  }
}
