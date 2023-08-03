import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { UploadFile } from 'src/entities/uploadFile.entities';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadFile)
    private uploadFileRepository: Repository<UploadFile>,
  ) {}

  async addFile(file: Express.Multer.File) {
    const uploadFile = new UploadFile();

    uploadFile.filename = file.filename;
    uploadFile.path = file.path;
    uploadFile.mimetype = file.mimetype;
    uploadFile.uid = '';
    uploadFile.size = file.size;
    uploadFile.originalname = file.originalname;

    return await this.uploadFileRepository.save(uploadFile);
  }

  /**
   * 根据文件id查找文件详情
   * @param id 文件ID
   * @returns {UploadFile} 文件信息
   */
  async findFile(id: string): Promise<UploadFile> {
    const result = await this.uploadFileRepository.find({ where: { id } });

    return result[0];
  }
}
