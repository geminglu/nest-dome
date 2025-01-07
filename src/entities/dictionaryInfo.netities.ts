import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dictionary_info', { schema: 'application' })
export class DictionaryInfoNetities {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'dictionary_code', length: 36 })
  dictionaryCode: string;

  @Column('varchar', { name: 'remark', nullable: true, length: 255 })
  remark: string | null;

  @CreateDateColumn({ name: 'create_at', comment: '创建时间' })
  createAt: Date;

  @Column('enum', {
    name: 'status',
    comment: '启用状态：0:禁用；1:激活',
    enum: ['0', '1'],
  })
  status: '0' | '1';

  @Column('int', { name: 'sort', nullable: true, default: 0 })
  sort: number;

  @Column('varchar', { name: 'fields_text', length: 36 })
  fieldsText: string;

  @Column('varchar', { name: 'fields_value', length: 255 })
  fieldsValue: string;
}
