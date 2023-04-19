import { PartialType } from '@nestjs/mapped-types';
import { FileUploadDto } from './create-upload.dto';

export class UpdateUploadDto extends PartialType(FileUploadDto) {}
