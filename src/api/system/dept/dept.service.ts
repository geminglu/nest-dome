import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDeptDto, QueryDeptDto, UpdateDeptDto } from '../dto/dept.dto';
import { Between, DataSource, FindOptionsWhere, Like, QueryRunner, Repository } from 'typeorm';
import { SysDept } from 'src/entities/SysDept';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntities } from 'src/entities/user.entities';
import { isNotEmpty } from 'src/utils/is';

@Injectable()
export class DeptService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(SysDept)
    private readonly SysDeptNetities: Repository<SysDept>,
  ) {}
  /**
   * 创建部门
   */
  async create(deptDto: CreateDeptDto, userId: string) {
    console.log(333, userId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (deptDto.parentId) {
        const t = await this.SysDeptNetities.findOne({
          where: { id: deptDto.parentId, delFlag: '0' },
        });
        if (!t) throw new BadRequestException('parentId不存在');
      }

      const dept = new SysDept();
      deptDto.deptName !== undefined && (dept.deptName = deptDto.deptName);
      deptDto.email !== undefined && (dept.email = deptDto.email);
      deptDto.leader !== undefined && (dept.leader = deptDto.leader);
      deptDto.orderNum !== undefined && (dept.orderNum = deptDto.orderNum);
      deptDto.parentId !== undefined && (dept.parentId = deptDto.parentId);
      deptDto.phone !== undefined && (dept.phone = deptDto.phone);
      deptDto.remark !== undefined && (dept.remark = deptDto.remark);
      deptDto.status !== undefined && (dept.status = deptDto.status);
      dept.createBy = userId;
      const deptResult = await queryRunner.manager.save<SysDept>(dept);
      await queryRunner.commitTransaction();
      return deptResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 查询部门列表
   */
  async findAll(query: QueryDeptDto & { id?: number }) {
    const where: FindOptionsWhere<SysDept> = {
      id: query.id,
      deptName: isNotEmpty(query.deptName) ? Like(`%${query.deptName}%`) : undefined,
      phone: isNotEmpty(query.phone) ? Like(`%${query.phone}%`) : undefined,
      email: isNotEmpty(query.email) ? Like(`%${query.email}%`) : undefined,
      remark: isNotEmpty(query.remark) ? Like(`%${query.remark}%`) : undefined,
      leader: query.leader,
      status: query.status,
      parentId: query.parentId ? query.parentId : undefined,
      createAt: Between(
        new Date(query.createTimeStart || 0),
        new Date(query.createTimeEnd || Date.now()),
      ),
      updateTime: Between(
        new Date(query.updateTimeStart || 0),
        new Date(query.updateTimeEnd || Date.now()),
      ),
      delFlag: '0',
    };

    const order = {};
    (query.sort || []).forEach((item) => {
      order[item.prop] = item.order;
    });

    Object.keys(where).forEach((key) => where[key] === undefined && delete where[key]);

    const builder = this.SysDeptNetities.createQueryBuilder('dept')
      .leftJoin(UserEntities, 'uc', 'uc.id = dept.create_by')
      .leftJoin(UserEntities, 'up', 'up.id = dept.updateBy')
      .leftJoin(UserEntities, 'ul', 'ul.id = dept.leader')
      .leftJoin(SysDept, 'bu', 'bu.id = dept.parentId')
      .select([
        'uc.name as createByName',
        'up.name as updateByName',
        'ul.name as leaderName',
        'dept.parent_id as parentId',
        'bu.dept_name as parentName',
        'dept.dept_name as deptName',
        'dept.order_num as orderNum',
        'dept.create_by as createBy',
        'dept.create_at as createAt',
        'dept.update_by as updateBy',
        'dept.update_time as updateTime',
        'dept.id as id',
        'dept.leader as leader',
        'dept.phone as phone',
        'dept.email as email',
        'dept.status as status',
        'dept.remark as remark',
      ])
      .where(where)
      .orderBy(order)
      .addOrderBy('createBy', 'DESC');

    const [list, total] = await Promise.all([builder.getRawMany(), builder.getCount()]);
    return { list, total };
  }

  async findOne(id: number) {
    const data = (await this.findAll({ id })).list[0];
    if (!data) {
      throw new BadRequestException('id不存在');
    }
    return data;
  }

  /**
   * 修改部门信息
   */
  async update(id: number, updateDeptDto: UpdateDeptDto & { userId: string }, tx?: QueryRunner) {
    const queryRunner = tx || this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (updateDeptDto.parentId) {
        const t = await this.SysDeptNetities.findOne({
          where: { id: updateDeptDto.parentId, delFlag: '0' },
        });
        if (!t) throw new BadRequestException('parentId不存在');
      }
      if (id === updateDeptDto.parentId) {
        throw new BadRequestException('parentId不能设置成该部门的Id');
      }
      const sysDeptData = new SysDept();
      updateDeptDto.deptName !== undefined && (sysDeptData.deptName = updateDeptDto.deptName);
      updateDeptDto.email !== undefined && (sysDeptData.email = updateDeptDto.email);
      updateDeptDto.leader !== undefined && (sysDeptData.leader = updateDeptDto.leader);
      updateDeptDto.orderNum !== undefined && (sysDeptData.orderNum = updateDeptDto.orderNum);
      updateDeptDto.parentId !== undefined && (sysDeptData.parentId = updateDeptDto.parentId);
      updateDeptDto.phone !== undefined && (sysDeptData.phone = updateDeptDto.phone);
      updateDeptDto.remark !== undefined && (sysDeptData.remark = updateDeptDto.remark);
      updateDeptDto.status !== undefined && (sysDeptData.status = updateDeptDto.status);
      sysDeptData.updateBy = updateDeptDto.userId;

      const up = await queryRunner.manager.update<SysDept>(SysDept, id, sysDeptData);
      !tx && (await queryRunner.commitTransaction());
      if (!up.affected) throw new BadRequestException('id不存在');
      const data = (await this.findAll({ id })).list[0];
      return data;
    } catch (error) {
      !tx && (await queryRunner.rollbackTransaction());
      throw error;
    } finally {
      !tx && (await queryRunner.release());
    }
  }

  async remove(id: number, tx?: QueryRunner) {
    const queryRunner = tx || this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const tz = await this.SysDeptNetities.findOne({ where: { parentId: id, delFlag: '0' } });
      if (tz) throw new BadRequestException('存在子节点无法删除');
      const t = await this.SysDeptNetities.findOne({ where: { id, delFlag: '0' } });
      if (!t) throw new BadRequestException('id不存在');

      const up = await queryRunner.manager.update<SysDept>(SysDept, id, { delFlag: '1' });
      !tx && (await queryRunner.commitTransaction());
      return up;
    } catch (error) {
      !tx && (await queryRunner.rollbackTransaction());
      throw error;
    } finally {
      !tx && (await queryRunner.release());
    }
  }
}
