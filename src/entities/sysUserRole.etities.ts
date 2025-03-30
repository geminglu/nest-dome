import { Column, Entity } from 'typeorm';

@Entity('sys_user_role', { schema: 'application' })
export class SysUserRoleNetities {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('int', { name: 'userId' })
  userId: number;

  @Column('int', { name: 'roleId' })
  roleId: number;
}
