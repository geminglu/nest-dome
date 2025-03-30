import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sys_role', { schema: 'application' })
export class SysRoleNetities {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    comment: '角色名称',
    length: 64,
    unique: true,
  })
  name: string | null;

  @Column('varchar', {
    name: 'remark',
    nullable: true,
    comment: '备注',
    length: 255,
  })
  remark: string | null;

  @CreateDateColumn({
    name: 'create_at',
    comment: '创建时间',
  })
  createAt: Date | null;

  @CreateDateColumn({
    name: 'update_time',
    comment: '修改时间',
  })
  updateTime: Date | null;
}
