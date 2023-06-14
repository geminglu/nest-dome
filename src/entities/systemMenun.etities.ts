import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';

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

  @Column('enum', { name: 'hidden', enum: SystemMenuHidden, comment: 'hidden' })
  hidden: SystemMenuHidden;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;
}
