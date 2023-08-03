import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('upload_file', { schema: 'application' })
export class UploadFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'filename', nullable: true, length: 255 })
  filename: string;

  @Column('varchar', { name: 'path', length: 255 })
  path: string;

  @Column('varchar', { name: 'mimetype', nullable: true, length: 255 })
  mimetype: string;

  @Column('varchar', { name: 'uid', nullable: true, length: 255 })
  uid: string;

  @Column('double', { name: 'size', nullable: true })
  size: number;

  @Column('varchar', { name: 'originalname', nullable: true, length: 255 })
  originalname: string;

  @CreateDateColumn({ name: 'create_at', comment: '上传文件的时间' })
  createAt: Date;
}
