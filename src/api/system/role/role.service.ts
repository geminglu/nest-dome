import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto, QueryDeptDto, UpdateRoleDto } from '../dto/role.dto';
import { DataSource, Equal, FindOptionsWhere, Like, Not, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SysRoleNetities } from 'src/entities/sysRole.etities';
import { handelPaging } from 'src/utils';
import { SysRoleMenuNetities } from 'src/entities/sysRoleMenu.etities';

@Injectable()
export class RoleService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(SysRoleNetities)
    private readonly sysRoleRepository: Repository<SysRoleNetities>,
    @InjectRepository(SysRoleMenuNetities)
    private readonly sysRoleMenuRepository: Repository<SysRoleMenuNetities>,
  ) {}

  async create(createRoleDto: CreateRoleDto, tx?: QueryRunner) {
    const queryRunner = tx || this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const rd = await this.sysRoleRepository.findOne({ where: { name: createRoleDto.name } });
      if (rd) {
        throw new BadRequestException('角色名称已经存在');
      }

      const role = new SysRoleNetities();
      createRoleDto.name && (role.name = createRoleDto.name);
      createRoleDto.remark && (role.remark = createRoleDto.remark);
      const roleResult = await queryRunner.manager.save<SysRoleNetities>(role);

      await queryRunner.manager.insert(
        SysRoleMenuNetities,
        (createRoleDto.menuPermissions || []).map((item) => ({
          roleId: roleResult.id,
          menuId: item,
        })),
      );

      !tx && (await queryRunner.commitTransaction());
      return roleResult;
    } catch (error) {
      !tx && (await queryRunner.rollbackTransaction());
      throw error;
    } finally {
      !tx && (await queryRunner.release());
    }
  }

  async findAll(params: QueryDeptDto) {
    const { skip, take } = handelPaging(params.page, params.pageSize);

    const order = {};
    (params.sort || []).forEach((item) => {
      order[item.prop] = item.order;
    });

    const where: FindOptionsWhere<SysRoleNetities> = {
      name: Like(`%${params.name || ''}%`),
    };

    const builder = this.sysRoleRepository
      .createQueryBuilder('role')
      .where(where)
      .leftJoin(SysRoleMenuNetities, 'm', 'm.roleId = role.id')
      .select([
        'role.id as id',
        'role.name as name',
        'role.remark as remark',
        'role.create_at as createAt',
        'role.update_time as updateTime',
        'COALESCE(NULLIF(JSON_ARRAYAGG(m.menuId), JSON_ARRAYAGG(NULL)), JSON_ARRAY()) as menuPermissions',
      ])
      .limit(take)
      .offset(skip)
      .orderBy(order)
      .groupBy('role.id');

    const [list, total] = await Promise.all([await builder.getRawMany(), await builder.getCount()]);

    return { list, total };
  }

  async findOne(id: number) {
    const builder = this.sysRoleRepository
      .createQueryBuilder('role')
      .where({ id })
      .leftJoin(SysRoleMenuNetities, 'm', 'm.roleId = role.id')
      .select([
        'role.id as id',
        'role.name as name',
        'role.remark as remark',
        'role.create_at as createAt',
        'role.update_time as updateTime',
        'COALESCE(NULLIF(JSON_ARRAYAGG(m.menuId), JSON_ARRAYAGG(NULL)), JSON_ARRAY()) as menuPermissions',
      ])
      .groupBy('role.id');
    return await builder.getRawOne<SysRoleNetities & { menuPermissions: string[] }>();
  }

  async update(id: number, updateRoleDto: UpdateRoleDto, tx?: QueryRunner) {
    const queryRunner = tx || this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (updateRoleDto.name) {
        const rd = await this.sysRoleRepository.findOne({
          where: { name: updateRoleDto.name, id: Not(id) },
        });

        if (rd) {
          throw new BadRequestException('角色名称已经存在');
        }
      }

      const role = new SysRoleNetities();
      updateRoleDto.name && (role.name = updateRoleDto.name);
      updateRoleDto.remark && (role.remark = updateRoleDto.remark);

      if (Object.values(role).some((t) => t)) {
        await queryRunner.manager.update(SysRoleNetities, id, role);
      }

      if (updateRoleDto.menuPermissions) {
        await queryRunner.manager.delete(SysRoleMenuNetities, {
          roleId: Equal(id),
        });

        await queryRunner.manager.insert(
          SysRoleMenuNetities,
          (updateRoleDto.menuPermissions || []).map((item) => ({ roleId: id, menuId: item })),
        );
      }

      !tx && (await queryRunner.commitTransaction());
      return {
        ...(await this.sysRoleRepository.findOne({
          where: { id },
        })),
        menuPermissions: updateRoleDto.menuPermissions,
      };
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
      const dele = await queryRunner.manager.delete(SysRoleNetities, { id });
      await queryRunner.commitTransaction();
      if (!dele.affected) throw new BadRequestException('数据不存在');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
