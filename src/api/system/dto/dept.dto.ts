import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  OmitType,
  IntersectionType,
  PickType,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  IsNumberString,
  IsNumber,
  Matches,
  IsEnum,
  IsInt,
  isString,
  IsEmail,
  IsMobilePhone,
  Min,
  IsDateString,
  isInt,
} from 'class-validator';
import { QueryPaging, QuerySortOrdersDto } from 'src/dto';

export enum StatusEnum {
  ENABLE = '0',
  DISABLE = '1',
}

export class DeptDtoInfo {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ title: '部门ID' })
  id: number;

  @ApiPropertyOptional({ title: '父部门id' })
  @IsInt()
  @IsOptional()
  parentId?: number | null;

  @ApiPropertyOptional({ title: '父部门名称' })
  @IsString()
  @IsOptional()
  parentName?: string | null;

  @ApiProperty({ title: '部门名称' })
  @IsString()
  @IsNotEmpty()
  deptName: string;

  @ApiPropertyOptional({ title: '显示顺序', minimum: 0, type: 'integer' })
  @IsInt()
  @IsOptional()
  @Min(0)
  orderNum?: number | null;

  @ApiPropertyOptional({ title: '负责人' })
  @IsInt()
  @IsOptional()
  leader?: number | null;

  @ApiPropertyOptional({ title: '联系电话' })
  @IsMobilePhone('zh-CN')
  @IsOptional()
  phone?: string | null;

  @ApiPropertyOptional({ title: '邮箱' })
  @IsEmail()
  @IsOptional()
  email?: string | null;

  @ApiProperty({ title: '部门状态（0正常 1停用）', enum: StatusEnum })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum)
  status: string;

  @ApiPropertyOptional({ title: '创建者' })
  @IsString()
  @IsOptional()
  createBy?: string | null;

  @ApiPropertyOptional({ title: '创建者姓名' })
  @IsString()
  @IsOptional()
  createByName?: string | null;

  @ApiProperty({ title: '创建时间' })
  @IsString()
  @IsOptional()
  createAt: string;

  @ApiPropertyOptional({ title: '更新者', type: Date })
  @IsString()
  @IsOptional()
  updateBy?: string | null;

  @ApiPropertyOptional({ title: '更新者姓名' })
  @IsString()
  @IsOptional()
  updateByName?: string | null;

  @ApiPropertyOptional({ title: '部门主管姓名' })
  @IsString()
  @IsOptional()
  leaderName?: string | null;

  @ApiPropertyOptional({ title: '更新时间', type: Date })
  @IsString()
  @IsOptional()
  updateTime: string;

  @ApiPropertyOptional({ title: '备注' })
  @IsString()
  @IsOptional()
  remark?: string | null;
}

export class CreateDeptDto extends IntersectionType(
  OmitType(DeptDtoInfo, [
    'status',
    'id',
    'createBy',
    'createByName',
    'updateBy',
    'updateByName',
    'createAt',
    'updateTime',
    'parentName',
    'leaderName',
  ]),
  PickType(PartialType(DeptDtoInfo), ['status']),
) {}

export class UpdateDeptDto extends PartialType(CreateDeptDto) {}

export class QueryDeptDto extends IntersectionType(
  PartialType(QuerySortOrdersDto),
  OmitType(UpdateDeptDto, ['orderNum', 'phone', 'email']),
) {
  @ApiPropertyOptional({ title: '联系电话' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ title: '邮箱' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ title: '创建时间开始', type: Date })
  @IsDateString()
  @IsOptional()
  createTimeStart?: string;

  @ApiPropertyOptional({ title: '创建时间结束', type: Date })
  @IsDateString()
  @IsOptional()
  createTimeEnd?: string;

  @ApiPropertyOptional({ title: '更新时间开始', type: Date })
  @IsDateString()
  @IsOptional()
  updateTimeStart?: string;

  @ApiPropertyOptional({ title: '更新时间结束', type: Date })
  @IsDateString()
  @IsOptional()
  updateTimeEnd?: string;
}
