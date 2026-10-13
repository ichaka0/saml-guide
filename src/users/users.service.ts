import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/pagination-query.dto';
import { paginate } from 'src/common/utils/paginate';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.userRepository.create({
      ...createUserDto,
      password: createUserDto.password
        ? await bcrypt.hash(createUserDto.password, 12)
        : null,
    });
    const savedUser = await this.userRepository.save(user);
    const { password, ...safeUser } = savedUser;
    return safeUser;
  }

 async findByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findAll(paginationQuery:PaginationQueryDto) {
   const users = await paginate<User>(this.userRepository.createQueryBuilder('user'), paginationQuery);
   return users;
  }
}
