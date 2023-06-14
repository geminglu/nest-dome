import { Injectable } from '@nestjs/common';
import { CreateSystemDto } from './dto/create-system.dto';
import { ResultData } from 'src/utils/result';
import { DataSource, Repository } from 'typeorm';
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
    }
  }
}
