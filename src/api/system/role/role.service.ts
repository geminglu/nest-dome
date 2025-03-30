import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto, QueryDeptDto, UpdateRoleDto } from '../dto/role.dto';
import { DataSource, Not, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SysRoleNetities } from 'src/entities/sysRole.etities';
import { handelPaging } from 'src/utils';

@Injectable()
export class RoleService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(SysRoleNetities)
    private readonly sysRoleRepository: Repository<SysRoleNetities>,
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

    const [list, total] = await this.sysRoleRepository.findAndCount({
      where: {
        name: params.name,
      },
      order: order,
      skip,
      take,
    });
    return { list, total };
  }

  async findOne(id: number) {
    return await this.sysRoleRepository.findOne({ where: { id } });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto, tx?: QueryRunner) {
    const queryRunner = tx || this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const rd = await this.sysRoleRepository.findOne({
        where: { name: updateRoleDto.name, id: Not(id) },
      });
      if (rd) {
        throw new BadRequestException('角色名称已经存在');
      }

      const role = new SysRoleNetities();
      updateRoleDto.name && (role.name = updateRoleDto.name);
      updateRoleDto.remark && (role.remark = updateRoleDto.remark);
      await queryRunner.manager.update(SysRoleNetities, id, role);

      !tx && (await queryRunner.commitTransaction());
      return await this.sysRoleRepository.findOne({
        where: { id },
      });
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
