import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { QueryUserDto } from './dto/query-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Like,
  DataSource,
  QueryRunner,
  Between,
  Not,
  In,
  FindOptionsWhere,
} from 'typeorm';
import { UserEntities } from 'src/entities/user.entities';
import { UserRole, Active } from 'src/types/user';
import { ResultData } from 'src/utils/result';
import { LoginLogNetities } from 'src/entities/loginLog.netities';
import { QueryPaging } from 'src/dto';
import { handelPaging } from 'src/utils';
import { SysDept } from 'src/entities/SysDept';
import { DeptService } from '../system/dept/dept.service';
import { CreateUserDto, UserInfo } from './dto/userDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntities)
    private usersRepository: Repository<UserEntities>,
    @InjectRepository(LoginLogNetities)
    private LoginLogRepository: Repository<LoginLogNetities>,
    @InjectRepository(SysDept)
    private SysDeptRepository: Repository<SysDept>,
    private dataSource: DataSource,
    private deptService: DeptService,
  ) {}

  /**
   * 创建用户
   * @param createUser
   * @param transaction 事务
   * @returns
   */
  async create(createUser: CreateUserDto & { password: string }, queryRunner: QueryRunner) {
    // 创建之前先判断用户名，邮箱和手机号是否存在
    const verify = await this.verifyIsCreateUser(createUser);
    if (verify) {
      throw new Error(verify);
    }
    if (createUser.deptId) {
      const dept = await this.SysDeptRepository.findOne({ where: { id: createUser.deptId } });
      if (!dept) {
        throw new BadRequestException('deptId不存在');
      }
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
    createUser.deptId && (user.deptId = createUser.deptId);
    const postRepository = await queryRunner.manager.save<UserEntities>(user);
    return {
      ...postRepository,
      password: createUser.password,
      deptName: (await this.deptService.findOne(createUser.deptId)).deptName,
    };
  }

  async findAll(query: QueryUserDto) {
    const { page, pageSize, ...res } = query;
    const { skip, take } = handelPaging(page, pageSize);

    const depts: number[] = [];
    if (query.deptId) {
      depts.push(...(await this.deptService.findSubDepts(query.deptId)).map((item) => item.id));
    }

    try {
      const order = {};
      (res.sort || []).forEach((item) => {
        order[item.prop] = item.order;
      });

      const where: FindOptionsWhere<UserEntities> = {
        phone: (res.phone && Like(`%${res.phone}%`)) || undefined,
        name: (res.name && Like(`%${res.name}%`)) || undefined,
        gender: res.gender || undefined,
        email: (res.email && Like(`%${res.email}%`)) || undefined,
        role: res.role || undefined,
        isActive: res.isActive || undefined,
        createAt: Between<Date>(
          new Date(res.createTimeStart || 0),
          new Date(res.createTimeEnd || Date.now()),
        ),
        deptId: depts.length ? In(depts) : undefined,
      };

      Object.keys(where).forEach((key) => where[key] === undefined && delete where[key]);

      const builder = this.usersRepository
        .createQueryBuilder('u')
        .leftJoin(SysDept, 'b', 'b.id = u.deptId')
        .where(where)
        .limit(take)
        .offset(skip)
        .orderBy(order)
        .select([
          'u.role as role',
          'u.name as name',
          'u.phone as phone',
          'u.isActive as isActive',
          'u.id as id',
          'u.gender as gender',
          'u.email as email',
          'u.deptId as deptId',
          'u.createAt as createAt',
          'u.avatars as avatars',
          'b.dept_name as deptName',
        ]);

      const [list, total] = await Promise.all([builder.getRawMany<UserInfo>(), builder.getCount()]);

      return { list, total };
    } finally {
      //
    }
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

  async update(id: string, user: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (user.email) {
        const u = await this.usersRepository.findOne({ where: { email: user.email, id: Not(id) } });
        if (u) return ResultData.fail('邮箱不能重复');
      }
      if (user.deptId) {
        const dept = await this.SysDeptRepository.findOne({ where: { id: user.deptId } });
        if (!dept) {
          throw new BadRequestException('deptId不存在');
        }
      }

      const updateUser = new UserEntities();
      user.avatars && (updateUser.avatars = user.avatars);
      user.email && (updateUser.email = user.email);
      user.gender ? (updateUser.gender = user.gender) : (updateUser.gender = null);
      user.isActive && (updateUser.isActive = user.isActive);
      user.name && (updateUser.name = user.name);
      user.phone && (updateUser.phone = user.phone);
      user.role && (updateUser.role = user.role);
      user.deptId && (updateUser.deptId = user.deptId);
      const up = await queryRunner.manager.update<UserEntities>(UserEntities, id, updateUser);
      await queryRunner.commitTransaction();
      if (!up.affected) return ResultData.fail('数据不存在');
      return ResultData.ok(user, '修改成功');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return ResultData.fail(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    if (!id) return ResultData.fail('id不能为空');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const dele = await queryRunner.manager.delete(UserEntities, { id });
      await queryRunner.commitTransaction();
      if (!dele.affected) return ResultData.fail('数据不存在');
      return ResultData.ok();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
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

  async verifyIsCreateUser(userInfo: Partial<UserEntities>) {
    if (await this.findUserName(userInfo.name)) {
      return '用户名已存在';
    }
    if (await this.findEmail(userInfo.email)) {
      return '邮箱已存在';
    }
    if (await this.findPhone(userInfo.phone as string)) {
      return '手机号已存在';
    }
    return null;
  }

  /**
   * 查询登陆日志
   * @param uid 用户ID
   */
  async getLogInLog(query: QueryPaging, uid?: string) {
    const { page, pageSize } = query;
    let take: number;
    let skip: number;
    if (page && pageSize) {
      take = pageSize <= 0 ? 1 : pageSize;
      skip = ((page <= 0 ? 1 : page) - 1) * take;
    } else {
      take = undefined;
      skip = undefined;
    }

    const builder = this.LoginLogRepository.createQueryBuilder('loginLog')
      .leftJoinAndMapOne('loginLog.user', UserEntities, 'user', 'user.id = loginLog.uid')
      .select('loginLog.*, user.name as userName')
      .where(uid ? 'loginLog.uid = :uid' : '1=1', { uid })
      .skip(skip)
      .take(take)
      .orderBy('loginLog.loginTime', 'DESC');

    const [timbers, timbersCount] = await Promise.all([builder.getRawMany(), builder.getCount()]);

    const list = timbers.map((i) => ({
      deviceInfo: i.device_info,
      loginTime: i.login_time,
      userName: i.userName,
      location: i.location,
      id: i.id,
      loginIp: i.login_ip,
    }));

    return ResultData.ok({ list, total: timbersCount });
  }
}
