import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { v4 } from 'uuid';
import { UploadFile } from 'src/entities/uploadFile';

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadFile]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), '/uploads'),
        filename: (_, file, callback) => {
          const fileName = () => `${new Date().getTime() + v4() + extname(file.originalname)}`;
          return callback(null, fileName());
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
