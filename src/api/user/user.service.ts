import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from 'src/entities/User';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUser: CreateUserDto) {
    const user = new User();
    user.gender = createUser.gender || null;
    user.age = createUser.age || null;
    user.userName = createUser.userName || null;
    user.phone = createUser.phone;
    user.avatars = createUser.avatars;
    user.name = createUser.name;
    user.email = createUser.email;
    user.createAt = new Date();
    user.role = createUser.role || 0;
    user.isActive = createUser.isActive || 0;
    user.password = '123456';
    const postRepository = await this.usersRepository.save(user);

    return postRepository;
  }

  async findAll(query: QueryUserDto): Promise<User[]> {
    const { page = 1, pageSize = 10, ...res } = query;
    const skip = page <= 0 ? 1 : page;
    const take = pageSize <= 0 ? 10 : pageSize;

    const results = await this.usersRepository.find({
      // relations: ['userName', 'role', 'gender'],
      where: {
        // userName: Like(res.userName),
        // role: res.role,
        // gender: res.gender,
        // isActive: res.isActive,
        // phone: Like(res.phone),
        // name: Like(res.name),
      },
      skip: (skip - 1) * skip,
      take,
    });
    console.log('res', results);

    return results;
  }

  /**
   *通过用户id查找用户
   * @param {string} id
   * @returns
   */
  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  update(id: string, updateUser: UpdateUserDto) {
    console.log(id, updateUser);

    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  /**
   * 通过用户名查找用户
   * @param userName 用户名
   * @returns Promise<User>
   */
  findUserName(userName: string) {
    return this.usersRepository.findOne({ where: { userName } });
  }
}
