import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Get,
  Res,
  Req,
  Param,
  Header,
} from '@nestjs/common';

import { createReadStream } from 'fs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadService } from './upload.service';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiOperation,
  ApiBearerAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { FileUploadDto } from './dto/create-upload.dto';
import {
  ResUnauthorized,
  ResServerErrorResponse,
  ResStream,
  ResCerated,
} from 'src/utils/api.Response';
import { ResultData } from 'src/utils/result';
import { UploadFile } from 'src/entities/uploadFile.entities';
import { Public } from 'src/decorators/public.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 } from 'uuid';
import { STATIC_PATH } from 'src/utils/constant';
import { STATIC_UP_PATH } from 'src/utils/constant';

@Controller({
  path: 'upload',
  version: '1',
})
@ApiTags('上传和下载')
@ApiBearerAuth()
@ResServerErrorResponse()
@ApiExtraModels(UploadFile)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @UseInterceptors(FilesInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '文件',
    type: FileUploadDto,
  })
  @ApiOperation({
    summary: '上传文件',
  })
  @ResUnauthorized()
  @ResCerated(UploadFile)
  async uploadFile(@UploadedFiles() file: Express.Multer.File[], @Req() req) {
    // 解决中文乱吗的问题
    file[0].originalname = Buffer.from(file[0].originalname, 'latin1').toString('utf8');
    return ResultData.ok(await this.uploadService.addFile(file[0], req.user.id), '上传成功');
  }

  @Post('staticFile')
  @UseInterceptors(
    FilesInterceptor('file', 1, {
      storage: diskStorage({
        destination: STATIC_UP_PATH,
        filename: (_, file, callback) => {
          const fileName = () => `${new Date().getTime() + v4() + extname(file.originalname)}`;
          return callback(null, fileName());
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '文件',
    type: FileUploadDto,
  })
  @ApiOperation({
    summary: '上传静态文件',
    description: '静态文件可以直接通过路径访问',
  })
  @Public()
  @ResCerated(String)
  async staticUploadFile(@UploadedFiles() file: Express.Multer.File[]) {
    // 解决中文乱吗的问题
    file[0].originalname = Buffer.from(file[0].originalname, 'latin1').toString('utf8');

    return ResultData.ok(
      (await this.uploadService.addFile(file[0])).path.replace(STATIC_UP_PATH, STATIC_PATH),
      '上传成功',
    );
  }

  @Get('file/:id')
  @ApiParam({ name: 'id', description: '文件ID' })
  @ApiOperation({
    summary: '下载文件',
  })
  @ResUnauthorized()
  @ResStream()
  async download(@Param('id') id: string, @Res() res: Response) {
    try {
      const fileDes = await this.uploadService.findFile(id);
      if (fileDes) {
        const fileStream = createReadStream(fileDes.path);
        res.set({
          'Content-Type': fileDes.mimetype,
          'Content-Disposition': `attachment; filename="${encodeURIComponent(
            fileDes.originalname,
          )}"`,
        });
        fileStream.pipe(res);
      } else {
        res.send(ResultData.fail('文件不存在'));
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
