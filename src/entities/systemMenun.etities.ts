import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

import { SystemMenu, SystemMenuHidden } from 'src/types/user';

@Entity('system_menu', { schema: 'application' })
export class SystemMenunNetities {
  @Column('enum', { name: 'type', enum: SystemMenu, comment: '目录或菜单' })
  type: SystemMenu;

  @Column('varchar', { name: 'icon', comment: 'icon' })
  icon: string;

  @Column('varchar', { name: 'name', comment: 'name', nullable: true })
  name: string | null;

  @Column('varchar', { name: 'title', comment: 'title' })
  title: string;

  @Column('varchar', { name: 'pid', nullable: true, comment: 'pid' })
  pid: string;

  @Column('enum', { name: 'hidden', enum: SystemMenuHidden, comment: '在系统菜单中隐藏' })
  hidden: SystemMenuHidden;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('enum', { name: 'status', comment: '0:禁用；\n1:启用', enum: ['0', '1'] })
  status: '0' | '1';

  @Column('varchar', { name: 'path', nullable: true, comment: '路由地址', length: 100 })
  path: string | null;
}
