import {
  ApiPropertyOptional,
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsInt, IsOptional } from 'class-validator';
import { QueryPaging, QuerySortOrdersDto } from 'src/dto';

export class CreateRoleDto {
  @ApiProperty({ title: '角色名称' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @ApiPropertyOptional({ title: '备注', type: 'string' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  remark?: string;
}

export class RoleInfoDto extends CreateRoleDto {
  @ApiProperty({ title: '角色Id', type: 'integer' })
  @IsInt()
  id: number;

  @ApiProperty({ title: '创建时间', type: Date })
  @IsString()
  @IsOptional()
  createAt: string;

  @ApiProperty({ title: '创建时间', type: Date })
  @IsString()
  @IsOptional()
  updateTime: string;
}

export class UpdateRoleDto extends CreateRoleDto {}

export class QueryDeptDto extends IntersectionType(
  PartialType(QuerySortOrdersDto),
  QueryPaging,
  PickType(PartialType(CreateRoleDto), ['name']),
) {}
