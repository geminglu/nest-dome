import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('sys_dept', { schema: 'application' })
export class SysDept {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '部门id' })
  id: number;

  @Column('int', {
    name: 'parent_id',
    nullable: true,
    comment: '父部门id',
  })
  parentId: number | null;

  @Column('varchar', {
    name: 'dept_name',
    nullable: true,
    comment: '部门名称',
    length: 30,
  })
  deptName: string;

  @Column('int', {
    name: 'order_num',
    nullable: true,
    comment: '显示顺序',
    default: () => '0',
  })
  orderNum: number | null;

  @Column('int', {
    name: 'leader',
    nullable: true,
    comment: '负责人',
  })
  leader: number | null;

  @Column('varchar', {
    name: 'phone',
    nullable: true,
    comment: '联系电话',
    length: 11,
  })
  phone: string | null;

  @Column('varchar', {
    name: 'email',
    nullable: true,
    comment: '邮箱',
    length: 50,
  })
  email: string | null;

  @Column('char', {
    name: 'status',
    comment: '部门状态（0正常 1停用）',
    length: 1,
    default: () => '0',
  })
  status: string;

  @Column('char', {
    name: 'del_flag',
    comment: '删除标志（0代表存在 1代表删除）',
    length: 1,
    default: () => '0',
  })
  delFlag: string;

  @Column('varchar', {
    name: 'create_by',
    nullable: true,
    comment: '创建者',
    length: 64,
  })
  createBy: string | null;

  @CreateDateColumn({
    name: 'create_at',
    comment: '创建时间',
  })
  createAt: Date;

  @Column('varchar', {
    name: 'update_by',
    nullable: true,
    comment: '更新者',
    length: 64,
  })
  updateBy: string | null;

  @UpdateDateColumn({
    name: 'update_time',
    comment: '更新时间',
  })
  updateTime: Date;

  @Column('varchar', {
    name: 'remark',
    nullable: true,
    comment: '备注',
    length: 500,
  })
  remark: string | null;
}
