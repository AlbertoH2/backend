import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject('USER_SERVICE') private readonly clientMail?: ClientProxy,
  ) {}

  // create(createUserDto: CreateUserDto) {
  //   return this.userRepository.save(createUserDto);
  // }


  async create(User: CreateUserDto) {
    const userFound = await this.userRepository.findOne({ where: { email: User.password } });

    if (userFound) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const newUser = this.userRepository.create(User);
    const savedUser = await this.userRepository.save(newUser);
    
    // Emite el evento 'user_created' con el nuevo usuario como datos
    this.clientMail.emit('user_created', savedUser);

    return savedUser;
}

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findByEmailWithPassword(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'],
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
