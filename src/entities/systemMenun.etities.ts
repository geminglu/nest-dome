import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

import { SystemMenuHidden } from 'src/types/user';

@Entity('system_menu', { schema: 'application' })
export class SystemMenunNetities {
  @Column('varchar', { name: 'icon', comment: 'icon', nullable: true })
  icon: string;

  @Column('varchar', { name: 'title', comment: 'title' })
  title: string;

  @Column('varchar', { name: 'pid', nullable: true, comment: 'pid' })
  pid: string | null;

  @Column('enum', { name: 'hidden', enum: SystemMenuHidden, comment: '在系统菜单中隐藏' })
  hidden: SystemMenuHidden;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('enum', { name: 'status', comment: '0:禁用；\n1:启用', enum: ['0', '1'] })
  status: '0' | '1';

  @Column('varchar', { name: 'path', comment: '路由地址', length: 100 })
  path: string | null;

  @Column('varchar', {
    name: 'remark',
    nullable: true,
    comment: '备注',
    length: 255,
  })
  remark: string | null;

  @Column('varchar', { name: 'type', nullable: false, length: 10 })
  type: string;
}
