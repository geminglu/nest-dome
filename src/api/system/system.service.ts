import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateDictionaryDetailDto,
  CreateDictionaryDto,
  CreateSystemDto,
  PatchDictionaryDetailDto,
  PatchDictionaryDto,
  QueryBaseDictionaryDto,
  QueryDictionaryIdDetailDto,
  patchSystemDto,
} from './dto/create-system.dto';
import { ResultData } from 'src/utils/result';
import { DataSource, Repository, Not, Like, QueryRunner } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemMenunNetities } from 'src/entities/systemMenun.etities';
import { SystemMenuHidden } from 'src/types/user';
import { DictionaryNetities } from 'src/entities/dictionary.netities';
import { DictionaryInfoNetities } from 'src/entities/dictionaryInfo.netities';

@Injectable()
export class SystemService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(SystemMenunNetities)
    private readonly SystemMenunRepository: Repository<SystemMenunNetities>,
    @InjectRepository(DictionaryNetities)
    private readonly DictionaryNetities: Repository<DictionaryNetities>,
    @InjectRepository(DictionaryInfoNetities)
    private readonly DictionaryInfoNetities: Repository<DictionaryInfoNetities>,
  ) {}

  async findMenu(id?: string) {
    return ResultData.ok(await this.SystemMenunRepository.find({ where: { id } }));
  }

  /**
   * 查询用户授权的菜单
   * @param id 用户ID
   */
  async getPermissionMenu(id: string) {
    // TODO 后期会根据用角色做过滤
    return ResultData.ok(await this.SystemMenunRepository.find({ where: { status: '1' } }));
  }

  async cerateMenu(body: CreateSystemDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const p = await this.SystemMenunRepository.findOne({ where: { id: body.pid } });
      if (!p) return ResultData.fail('所选pid不存在');
      const t = await this.SystemMenunRepository.findOne({ where: { title: body.title } });
      if (t) return ResultData.fail('菜单标题不能重复');

      const systemMenun = new SystemMenunNetities();
      systemMenun.hidden = body.hidden || SystemMenuHidden.NO;
      systemMenun.icon = body.icon;
      systemMenun.path = body.path;
      systemMenun.pid = body.pid || null;
      systemMenun.title = body.title;
      systemMenun.status = body.status || '1';
      const systemMenunResult = await queryRunner.manager.save<SystemMenunNetities>(systemMenun);
      await queryRunner.commitTransaction();
      return ResultData.ok(systemMenunResult);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
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
      const t = await this.SystemMenunRepository.findOne({
        where: { title: body.title, id: Not(id) },
      });
      if (t) return ResultData.fail('菜单标题不能重复');

      const systemMenun = new SystemMenunNetities();
      body.hidden && (systemMenun.hidden = body.hidden);
      body.icon && (systemMenun.icon = body.icon);
      body.path && (systemMenun.path = body.path);
      body.title && (systemMenun.title = body.title);
      body.status && (systemMenun.status = body.status);
      body.pid && (systemMenun.pid = body.pid);
      const menu = await queryRunner.manager.update<SystemMenunNetities>(
        SystemMenunNetities,
        id,
        systemMenun,
      );

      await queryRunner.commitTransaction();
      if (!menu.affected) return ResultData.fail('数据不存在');
      const menuRes = await this.SystemMenunRepository.findOne({
        where: { id },
      });
      return ResultData.ok(menuRes);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
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
      if (result) return ResultData.fail('菜单树下存在数据不能删除');
      const dele = await queryRunner.manager.delete(SystemMenunNetities, { id });
      await queryRunner.commitTransaction();
      if (!dele.affected) return ResultData.fail('数据不存在');
      return ResultData.ok();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 查询字典列表
   */
  async findDictionary(param: QueryBaseDictionaryDto) {
    const { page, pageSize, ...res } = param;
    const [timbers, timbersCount] = await this.DictionaryNetities.findAndCount({
      where: {
        name: res.name ? Like(`%${res.name}%`) : undefined,
        code: res.code,
        status: res.status,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createAt: 'DESC' },
    });
    // console.log('res.sort', res.sort.name);

    return { list: timbers, total: timbersCount };
  }

  /**
   * 创建字典
   */
  async cerateDictionary(body: CreateDictionaryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const t = await this.DictionaryNetities.findOne({ where: { code: body.code } });
      if (t) throw new BadRequestException('字典编码不能重复');

      const dictionary = new DictionaryNetities();
      dictionary.code = body.code;
      dictionary.name = body.name;
      dictionary.remark = body.remark;
      dictionary.status = body.status || '1';
      const dictionaryResult = await queryRunner.manager.save<DictionaryNetities>(dictionary);
      await queryRunner.commitTransaction();
      return dictionaryResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 修改字典
   */
  async patchDictionary(id: number, data: PatchDictionaryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const dictionary = new DictionaryNetities();
      dictionary.name = data.name;
      dictionary.remark = data.remark;
      dictionary.status = data.status;
      const dictionaryResult = await queryRunner.manager.update<DictionaryNetities>(
        DictionaryNetities,
        id,
        dictionary,
      );
      if (dictionaryResult.affected === 0) {
        throw new BadRequestException('id不存在');
      }
      const result = await queryRunner.manager.findOne(DictionaryNetities, { where: { id } });
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 删除字典
   */
  async deleteDictionary(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const dictionaryResult = await queryRunner.manager.delete<DictionaryNetities>(
        DictionaryNetities,
        id,
      );
      if (dictionaryResult.affected === 0) {
        throw new BadRequestException('id不存在');
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 查询字典详情
   */
  // async findDictionaryDetail(param: QueryDictionaryIdDetailDto) {
  //   const { page, pageSize, ...res } = param;
  //   const [timbers, timbersCount] = await this.DictionaryInfoNetities.findAndCount({
  //     where: {
  //       dictionaryCode: res.code,
  //       status: '1',
  //     },
  //     skip: page ? (page - 1) * pageSize : undefined,
  //     take: pageSize,
  //   });
  //   return { list: timbers, total: timbersCount };
  // }

  /**
   * 查询字典详情
   */
  async findDictionaryDetail(param: QueryDictionaryIdDetailDto) {
    const { page, pageSize, ...res } = param;
    const [timbers, timbersCount] = await this.DictionaryInfoNetities.findAndCount({
      where: {
        dictionaryCode: res.code,
        fieldsText: res.fieldsText ? Like(`%${res.fieldsText}%`) : undefined,
        fieldsValue: res.fieldsValue ? Like(`%${res.fieldsValue}%`) : undefined,
        status: res.status,
      },
      skip: page ? (page - 1) * pageSize : undefined,
      take: pageSize,
    });
    return { list: timbers, total: timbersCount };
  }

  /**
   * 创建字典详情
   */
  async cerateDictionaryDetails(body: CreateDictionaryDetailDto, tx?: QueryRunner) {
    const queryRunner = tx || this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const t = await this.DictionaryNetities.findOne({ where: { code: body.dictionaryCode } });
      if (!t) throw new BadRequestException('dictionaryCode不存在');

      const dictionary = new DictionaryInfoNetities();
      dictionary.fieldsText = body.fieldsText;
      dictionary.fieldsValue = body.fieldsValue;
      dictionary.sort = body.sort;
      dictionary.dictionaryCode = body.dictionaryCode;
      dictionary.remark = body.remark;
      dictionary.status = body.status || '1';
      const dictionaryResult = await queryRunner.manager.save<DictionaryInfoNetities>(dictionary);
      await queryRunner.commitTransaction();
      return dictionaryResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 修改字典详情
   */
  async patchDictionaryDetails(body: PatchDictionaryDetailDto, id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const dictionary = new DictionaryInfoNetities();
      dictionary.fieldsText = body.fieldsText;
      dictionary.fieldsValue = body.fieldsValue;
      dictionary.sort = body.sort;
      dictionary.status = body.status;
      dictionary.remark = body.remark;

      const dictionaryResult = await queryRunner.manager.update<DictionaryInfoNetities>(
        DictionaryInfoNetities,
        id,
        dictionary,
      );
      if (dictionaryResult.affected === 0) {
        throw new BadRequestException('id不存在');
      }
      await queryRunner.commitTransaction();

      const result = await queryRunner.manager.findOne(DictionaryInfoNetities, { where: { id } });
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 删除字典
   */
  async deleteDictionaryDetails(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const dictionaryResult = await queryRunner.manager.delete<DictionaryInfoNetities>(
        DictionaryInfoNetities,
        id,
      );
      if (dictionaryResult.affected === 0) {
        throw new BadRequestException('id不存在');
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
