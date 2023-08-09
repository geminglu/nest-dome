import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Get,
  Res,
  Req,
  Param,
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

@Controller({
  path: 'upload',
  version: '1',
})
@ApiTags('上传和下载')
@ResUnauthorized()
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
  @ResCerated(UploadFile)
  uploadFile(@UploadedFiles() file: Express.Multer.File[], @Req() req) {
    return this.uploadService.addFile(file[0], req.user.id);
  }

  @Get('file/:id')
  @ApiParam({ name: 'id', description: '文件ID' })
  @ApiOperation({
    summary: '下载文件',
  })
  @ResStream()
  async download(@Param('id') id: string, @Res() res: Response) {
    try {
      const fileDes = await this.uploadService.findFile(id);
      if (fileDes) {
        const fileStream = createReadStream(fileDes.path);
        res.set({
          'Content-Type': fileDes.mimetype,
          'Content-Disposition': `attachment; filename="${fileDes.originalname}"`,
        });
        fileStream.pipe(res);
      } else {
        res.send(ResultData.fail('文件不存在'));
      }
    } catch (error) {
      res.send(ResultData.fail(error.message));
    }
  }
}
