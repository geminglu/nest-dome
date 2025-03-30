import { Column, Entity } from 'typeorm';

@Entity('sys_role_menu', { schema: 'application' })
export class SysRoleMenuNetities {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('int', { name: 'roleId', comment: '角色ID' })
  roleId: number;

  @Column('int', { name: 'menuId', comment: '菜单ID' })
  menuId: number;
}
