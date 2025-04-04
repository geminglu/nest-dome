import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sys_role_menu', { schema: 'application' })
export class SysRoleMenuNetities {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'roleId', comment: '角色ID' })
  roleId: number;

  @Column('varchar', { name: 'menuId', comment: '菜单ID', length: 36 })
  menuId: string;
}
