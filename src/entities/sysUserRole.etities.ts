import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sys_user_role', { schema: 'application' })
export class SysUserRoleNetities {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'userId', length: 36 })
  userId: string;

  @Column('int', { name: 'roleId' })
  roleId: number;
}
