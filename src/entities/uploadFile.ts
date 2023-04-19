import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('upload_file', { schema: 'application' })
export class UploadFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'filename', nullable: true, length: 255 })
  filename: string | null;

  @Column('varchar', { name: 'path', nullable: true, length: 255 })
  path: string | null;

  @Column('varchar', { name: 'mimetype', nullable: true, length: 255 })
  mimetype: string | null;

  @Column('varchar', { name: 'uid', nullable: true, length: 255 })
  uid: string | null;

  @Column('double', { name: 'size', nullable: true, precision: 22 })
  size: number | null;

  @Column('varchar', { name: 'originalname', nullable: true, length: 255 })
  originalname: string | null;
}
