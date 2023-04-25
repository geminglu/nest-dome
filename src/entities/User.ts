import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user', { schema: 'application' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'user_name', comment: '用户名', length: 25 })
  userName: string;

  @Column('varchar', { name: 'email', comment: '邮箱', length: 255 })
  email: string;

  @Column('enum', {
    name: 'role',
    comment: '角色 0：管理员：1：普通用户',
    enum: [0, 1],
    default: () => '1',
  })
  role: 0 | 1;

  @Column('enum', {
    name: 'gender',
    nullable: true,
    comment: '1：男；0：女',
    enum: [0, 1],
  })
  gender: 0 | 1 | null;

  @Column('enum', {
    name: 'isActive',
    nullable: true,
    comment: '1：启用；0：禁用',
    enum: [0, 1],
    default: () => '0',
  })
  isActive: 0 | 1;

  @Column('smallint', { name: 'age', nullable: true, comment: '年龄' })
  age: number | null;

  @Column('datetime', { name: 'create_at', comment: '创建时间' })
  createAt: Date;

  @Column('bigint', { name: 'phone', nullable: true, comment: '手机号' })
  phone: number | string | null;

  @Column('varchar', {
    name: 'avatars',
    nullable: true,
    comment: '用户头像',
    length: 255,
  })
  avatars: string | null;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    comment: '真实姓名',
    length: 25,
  })
  name: string | null;

  @Column('varchar', { name: 'password', comment: '密码', length: 255 })
  password: string;
}
