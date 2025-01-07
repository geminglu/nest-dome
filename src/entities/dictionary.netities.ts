import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dictionary', { schema: 'application' })
export class DictionaryNetities {
  @Column('varchar', { name: 'name', comment: '字典名称', length: 36 })
  name: string;

  @Column('varchar', { name: 'code', comment: '字典编码', length: 36, unique: true })
  code: string;

  @Column('varchar', { name: 'remark', comment: '备注', length: 255 })
  remark: string;

  @CreateDateColumn({ name: 'create_at', comment: '创建时间' })
  createAt: Date;

  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('enum', {
    name: 'status',
    comment: '启用状态：0:禁用；1:激活',
    enum: ['0', '1'],
  })
  status: '0' | '1';
}
