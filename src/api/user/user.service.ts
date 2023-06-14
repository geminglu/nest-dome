import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/userDto';
import { RegisterUserDto } from '../auth/dto/auth.dto';
import { QueryUserDto } from './dto/query-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, EntityManager, TransactionOptions, DataSource, QueryRunner, Between } from 'typeorm';
import { UserEntities } from 'src/entities/user.entities';
import { UserRole, Active } from 'src/types/user';
import { ResultData } from 'src/utils/result';
import { User } from 'temp/entities/User';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntities)
    private usersRepository: Repository<UserEntities>,
    private dataSource: DataSource,
  ) {}

  /**
   * 创建用户
   * @param createUser
   * @param transaction 事务
   * @returns
   */
  async create(createUser: CreateUserDto & RegisterUserDto, queryRunner: QueryRunner) {
    // 创建之前先判断用户名，邮箱和手机号是否存在
    const verify = await this.verifyIsCreateUser(createUser);
    if (verify) {
      throw new Error(verify);
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUser.password, salt);

    const user = new UserEntities();
    user.gender = createUser.gender || null;
    user.phone = createUser.phone;
    user.avatars = createUser.avatars || null;
    user.name = createUser.name;
    user.email = createUser.email;
    user.role = createUser.role || UserRole.USER;
    user.isActive = createUser.isActive || Active.ENABLE;
    user.password = hash;
    const postRepository = await queryRunner.manager.save<UserEntities>(user);
    return postRepository;
  }

  async findAll(query: QueryUserDto) {
    const { page = 1, pageSize = 10, ...res } = query;
    const skip = page <= 0 ? 1 : page;
    const take = pageSize <= 0 ? 10 : pageSize;

    try {
      const [timbers, timbersCount] = await this.usersRepository.findAndCount({
        where: {
          phone: res.phone && Like(`%${res.phone}%`),
          name: res.name && Like(`%${res.name}%`),
          gender: res.gender,
          email: res.email && Like(`%${res.email}%`),
          role: res.role,
          isActive: res.isActive,
          createAt: Between<Date>(new Date(res.createTimeStart || 0), new Date(res.createTimeEnd || Date.now())),
        },
        skip: (skip - 1) * skip,
        take,
      });
      return {
        list: timbers,
        total: timbersCount,
        page: page <= 0 ? 1 : page,
        pageSize: pageSize <= 0 ? 10 : pageSize,
      };
    } catch (error) {}
  }

  /**
   *通过用户id查找用户
   * @param {string} id
   * @returns
   */
  findOne(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async getUserInfo(id: string) {
    const userInfo = await this.findOne(id);
    return ResultData.ok(userInfo);
  }

  update(id: string, updateUser: UpdateUserDto) {
    console.log(id, updateUser);

    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  /**
   * 通过用户名查找用户(精准查询)
   * @param userName 用户名
   * @returns Promise<UserEntities>
   */
  findUserName(userName: string) {
    if (!userName) return null;
    return this.usersRepository.findOne({ where: { name: userName } });
  }

  /**
   * 通过邮箱查找用户(精准查询)
   * @param email 邮箱
   * @returns Promise<UserEntities>
   */
  findEmail(email: string) {
    if (!email) return null;
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * 通过手机号查找用户(精准查询)
   * @param phone 手机号
   * @returns Promise<UserEntities>
   */
  findPhone(phone: string) {
    if (!phone) return null;
    return this.usersRepository.findOne({ where: { phone } });
  }

  async verifyIsCreateUser(userInfo: CreateUserDto) {
    if (await this.findUserName(userInfo.name)) {
      return '用户名已存在';
    }
    if (await this.findEmail(userInfo.email)) {
      return '邮箱已存在';
    }
    if (await this.findPhone(userInfo.phone)) {
      return '手机号已存在';
    }
    return null;
  }
}
