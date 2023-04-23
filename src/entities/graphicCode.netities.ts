import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('graphic_code', { schema: 'application' })
export class GraphicCodeNetities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('char', { name: 'code', length: 4 })
  code: string;

  @CreateDateColumn({ name: 'create_at', comment: '验证码生成时间' })
  createAt: Date;
}
