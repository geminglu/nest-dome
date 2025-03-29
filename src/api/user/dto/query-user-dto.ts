import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { LoginLogNetities } from 'src/entities/loginLog.netities';

import { UserRole, Gender, Active } from 'src/types/user';
import { QueryPaging, QuerySortOrdersDto } from 'src/dto';

export class QueryUserDto extends IntersectionType(QueryPaging, PartialType(QuerySortOrdersDto)) {
  @IsOptional()
  @ApiProperty({ enum: UserRole, description: '角色;0：管理员;1：普通用户', required: false })
  role?: UserRole;

  @IsOptional()
  @ApiProperty({ title: '姓名', required: false })
  name?: string;

  @IsOptional()
  @IsEnum(Gender)
  @ApiProperty({
    title: '性别',
    example: 1,
    enum: Gender,
    description: '1：男；0：女',
    required: false,
  })
  gender?: Gender;

  @IsOptional()
  @ApiProperty({ description: '邮箱', required: false })
  email?: string;

  @IsOptional()
  @ApiProperty({ description: '手机号', required: false })
  phone?: number;

  @IsEnum(Active)
  @IsOptional()
  @ApiProperty({ description: '1：启用；0：禁用', enum: Active, required: false })
  isActive?: Active;

  @IsOptional()
  @ApiProperty({ description: '创建时间开始', required: false })
  createTimeStart?: string;

  @IsOptional()
  @ApiProperty({ description: '创建时间结束', required: false })
  createTimeEnd?: string;

  @IsOptional()
  @ApiProperty({ title: '部门Id', required: false })
  deptId?: number;
}

export class LoginLogReqDto extends LoginLogNetities {
  @ApiProperty({ description: '用户名' })
  userName: string;
}
