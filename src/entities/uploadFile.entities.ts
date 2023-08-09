import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('upload_file', { schema: 'application' })
export class UploadFile {
  @ApiProperty({ title: '文件ID', type: 'string' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ title: '文件名称', type: 'string' })
  @Column('varchar', { name: 'filename', nullable: true, length: 255, comment: '文件名称' })
  filename: string;

  @ApiProperty({ title: '文件存储路径', type: 'string' })
  @Column('varchar', { name: 'path', length: 255, comment: '文件存储路径' })
  path: string;

  @ApiProperty({ title: '文件类型', type: 'string' })
  @Column('varchar', { name: 'mimetype', nullable: true, length: 255, comment: '文件类型' })
  mimetype: string;

  @ApiProperty({ title: '上传用户UID', type: 'string' })
  @Column('varchar', { name: 'uid', nullable: true, length: 255, comment: '上传用户UID' })
  uid: string;

  @ApiProperty({ title: '文件大小', type: 'string' })
  @Column('double', { name: 'size', nullable: true, comment: '文件大小' })
  size: number;

  @ApiProperty({ title: '文件原始名称', type: 'string' })
  @Column('varchar', { name: 'originalname', nullable: true, length: 255, comment: '文件原始名称' })
  originalname: string;

  @ApiProperty({ title: '上传文件的时间', type: Date })
  @CreateDateColumn({ name: 'create_at', comment: '上传文件的时间' })
  createAt: Date;
}
