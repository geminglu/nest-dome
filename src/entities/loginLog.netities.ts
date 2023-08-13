import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('login_log', { schema: 'application' })
export class LoginLogNetities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户ID' })
  @Column('varchar', { name: 'uid', comment: '用户ID', length: 36 })
  uid: string;

  @ApiProperty({ description: '登陆设备IP' })
  @Column('varchar', { name: 'login_ip', comment: '登陆设备的IP', length: 64 })
  loginIp: string;

  @ApiProperty({ description: '登陆页设备信息', required: false })
  @Column('varchar', {
    name: 'device_info',
    nullable: true,
    comment: '登陆页设备信息',
    length: 500,
  })
  deviceInfo: string | null;

  @ApiProperty({ description: '登陆时间' })
  @Column('datetime', {
    name: 'login_time',
    comment: '登陆时间',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  loginTime: Date;
}
