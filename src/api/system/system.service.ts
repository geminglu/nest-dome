import { Injectable } from '@nestjs/common';
import { CreateSystemDto, patchSystemDto } from './dto/create-system.dto';
import { ResultData } from 'src/utils/result';
import { DataSource, Repository, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemMenunNetities } from 'src/entities/systemMenun.etities';
import { SystemMenuHidden } from 'src/types/user';

@Injectable()
export class SystemService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(SystemMenunNetities)
    private readonly SystemMenunRepository: Repository<SystemMenunNetities>,
  ) {}

  async findMenu() {
    return ResultData.ok(await this.SystemMenunRepository.find());
  }

  async cerateMenu(body: CreateSystemDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 创建菜单时路由名称不能为空
      if (body.type === 'menu' && !body.name) return ResultData.fail('创建菜单时路由名称不能为空');
      // 创建目录时icon不能为空
      if (body.type === 'directory' && !body.icon) return ResultData.fail('创建目录时icon不能为空');
      // 如果body中存在pid 需要验证pid是否在表中存在
      const p = await this.SystemMenunRepository.findOne({ where: { id: body.pid } });
      if (!p) return ResultData.fail('pid不存在');
      const t = await this.SystemMenunRepository.findOne({ where: { title: body.title } });
      if (t) return ResultData.fail('菜单标题不能重复');

      const systemMenun = new SystemMenunNetities();
      systemMenun.hidden = body.hidden || SystemMenuHidden.NO;
      systemMenun.icon = body.icon;
      systemMenun.name = body.name || null;
      systemMenun.pid = body.pid || null;
      systemMenun.title = body.title;
      systemMenun.type = body.type;
      const systemMenunResult = await queryRunner.manager.save<SystemMenunNetities>(systemMenun);
      await queryRunner.commitTransaction();
      return ResultData.ok(systemMenunResult);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async editMenu(body: patchSystemDto, id: string) {
    if (!id) return ResultData.fail('id不能为空');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 创建菜单时路由名称不能为空
      if (body.type === 'menu' && !body.name) return ResultData.fail('创建菜单时路由名称不能为空');
      // 创建目录时icon不能为空
      if (body.type === 'directory' && !body.icon) return ResultData.fail('创建目录时icon不能为空');
      const t = await this.SystemMenunRepository.findOne({ where: { title: body.title, id: Not(id) } });
      if (t) return ResultData.fail('菜单标题不能重复');

      const systemMenun = new SystemMenunNetities();
      body.hidden && (systemMenun.hidden = body.hidden);
      body.icon && (systemMenun.icon = body.icon);
      body.name && (systemMenun.name = body.name);
      body.title && (systemMenun.title = body.title);
      const menu = await queryRunner.manager.update<SystemMenunNetities>(SystemMenunNetities, id, systemMenun);
      await queryRunner.commitTransaction();
      if (!menu.affected) return ResultData.fail('数据不存在');
      return ResultData.ok();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleMenu(id: string) {
    if (!id) return ResultData.fail('id不能为空');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.SystemMenunRepository.findOne({ where: { pid: id } });
      if (result) return ResultData.fail('目录下存在数据不能删除');
      const dele = await queryRunner.manager.delete(SystemMenunNetities, { id });
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
}
