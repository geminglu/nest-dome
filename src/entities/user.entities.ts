import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole, Gender, Active } from 'src/types/user';

@Entity('user', { schema: 'application' })
export class UserEntities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'name', comment: '用户名', length: 25 })
  name: string;

  @Column('varchar', { name: 'email', comment: '邮箱', length: 255 })
  email: string;

  @Column('enum', {
    name: 'role',
    comment: '角色 0：管理员：1：普通用户',
    enum: UserRole,
    default: UserRole.USER,
  })
  role?: UserRole;

  @Column('enum', { name: 'gender', nullable: true, comment: '1：男；0：女', enum: Gender })
  gender?: Gender;

  @Column('enum', {
    name: 'isActive',
    nullable: true,
    comment: '1：启用；0：禁用',
    enum: Active,
    default: Active.ENABLE,
  })
  isActive?: Active;

  @CreateDateColumn({ name: 'create_at', comment: '创建时间' })
  createAt: Date;

  @Column('bigint', { name: 'phone', nullable: true, comment: '手机号' })
  phone?: number | string;

  @Column('varchar', { name: 'avatars', nullable: true, comment: '用户头像', length: 255 })
  avatars?: string | null;

  @Column('varchar', { name: 'password', comment: '密码', length: 255 })
  password: string;

  @Column('int', { name: 'deptId', nullable: true, comment: '所在部门' })
  deptId?: number | null;
}
