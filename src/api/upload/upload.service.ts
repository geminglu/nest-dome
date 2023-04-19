import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { UploadFile } from 'src/entities/uploadFile';

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

  findAll() {
    return `This action returns all upload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
