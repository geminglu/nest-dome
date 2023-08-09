import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { UploadFile } from 'src/entities/uploadFile.entities';
import { ResultData } from 'src/utils/result';
import { v4 } from 'uuid';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadFile)
    private uploadFileRepository: Repository<UploadFile>,
    private dataSource: DataSource,
  ) {}

  /**
   * 存储文件
   * @param {Express.Multer.File} file
   * @param {string} uid 上传文件人的用户ID
   */
  async addFile(file: Express.Multer.File, uid: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const uploadFile = new UploadFile();

      uploadFile.filename = file.filename;
      uploadFile.path = file.path;
      uploadFile.mimetype = file.mimetype;
      uid && (uploadFile.uid = uid);
      uploadFile.size = file.size;
      uploadFile.originalname = file.originalname;

      const fileInfo = await queryRunner.manager.save<UploadFile>(uploadFile);
      await queryRunner.commitTransaction();
      return ResultData.ok(fileInfo, '上传成功');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 根据文件id查找文件详情
   * @param id 文件ID
   * @returns {UploadFile} 文件信息
   */
  async findFile(id: string): Promise<UploadFile> {
    const result = await this.uploadFileRepository.findOne({ where: { id } });
    return result;
  }
}
