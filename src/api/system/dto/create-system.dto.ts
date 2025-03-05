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
} from 'class-validator';
import { SystemMenuHidden } from 'src/types/user';
import { QueryPaging, SortOrder } from 'src/dto';
// import type { SortOrder } from 'src/dto';
import { Type } from 'class-transformer';

export class CreateSystemDto {
  @ApiPropertyOptional({ title: 'icon', description: '如果创建目录icon必填' })
  @IsOptional()
  @IsString()
  icon: string;

  // @ApiPropertyOptional({
  //   title: '路由名称',
  //   description: '如果是是菜单路由名称就必须存在',
  //   maxLength: 10,
  // })
  // @MaxLength(10)
  // @IsOptional()
  // @IsString()
  // name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pid: string;

  @ApiProperty({ title: '是否隐藏菜单', enum: SystemMenuHidden, description: '1:显示；0:隐藏' })
  hidden: SystemMenuHidden;

  @MaxLength(10)
  @ApiProperty({ title: 'title' })
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  @IsString()
  title: string;

  @IsOptional()
  @ApiPropertyOptional({ title: '状态', description: '0:禁用；1:启用', default: '1' })
  @IsNumberString()
  status?: SystemMenuHidden;

  @MaxLength(100)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ title: '路由地址', description: '如果是菜单必传' })
  path?: string | null;

  @MaxLength(255)
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ title: '备注' })
  remark?: string;

  @ApiProperty({ title: 'type', description: 'menu:菜单；dir:目录' })
  @IsString()
  @IsEnum(['menu', 'dir'])
  type: 'menu' | 'dir';
}

export class ResSystemMenuDto extends CreateSystemDto {
  @ApiProperty({ title: 'id', required: true })
  @IsString()
  id: string;

  @ApiProperty({ title: 'createAt', required: true })
  @IsString()
  createAt: string;
}

export class patchSystemDto extends PartialType(CreateSystemDto) {}

/**
 * 创建字典
 */
export class CreateDictionaryDto {
  @ApiProperty({ title: '字典名称', required: true, maxLength: 36 })
  @IsString()
  @MaxLength(36)
  name: string;

  @ApiProperty({ title: '字典编码', required: true, maxLength: 36 })
  @IsString()
  @MaxLength(36)
  @Matches(/^[a-zA-Z0-9_-]{3,36}$/, { message: '必须是字母数字-_ 3-16位字符' })
  code: string;

  @ApiPropertyOptional({ title: '备注' })
  @IsString()
  @IsOptional()
  remark: string;

  @ApiPropertyOptional({ title: '状态', enum: ['0', '1'] })
  @IsNumberString()
  @IsOptional()
  status: '0' | '1';
}

/**
 * 字典列表
 */
export class DictionaryListDto extends OmitType(CreateDictionaryDto, ['status', 'remark']) {
  @ApiProperty({ title: 'id' })
  id: number;

  @ApiProperty({ title: 'createAt', required: true })
  createAt: string;

  @ApiProperty({ title: '状态', enum: ['0', '1'] })
  status: '0' | '1';

  @ApiProperty({ title: '备注' })
  remark: string;
}

/**
 * 修改字典
 */
export class PatchDictionaryDto extends PartialType(OmitType(CreateDictionaryDto, ['code'])) {}

/**
 * 字段查询参数
 */
export class QueryBaseDictionaryDto extends IntersectionType(QueryPaging) {
  @ApiPropertyOptional({ title: '字典名称', required: true, maxLength: 36 })
  @IsOptional()
  @IsString()
  @MaxLength(36)
  name?: string;

  @ApiPropertyOptional({ title: '字典编码', required: true, maxLength: 36 })
  @IsOptional()
  @IsString()
  @MaxLength(36)
  @Matches(/^[a-zA-Z0-9_-]{3,36}$/, { message: 'code必须是字母数字-_ 3-16位字符' })
  code?: string;

  @ApiPropertyOptional({ title: '状态', enum: ['0', '1'] })
  @IsOptional()
  @IsNumberString()
  status?: '0' | '1';

  @ApiPropertyOptional({ title: '排序', example: { name: 'descend', code: 'ascend' } })
  @IsOptional()
  @Type(() => SortOrder)
  sort?: SortOrder;
}

/**
 * 创建字典详情
 */
export class CreateDictionaryDetailDto {
  @ApiProperty({ title: '字典名称', required: true, maxLength: 36 })
  @IsString()
  @MaxLength(36)
  dictionaryCode: string;

  @ApiPropertyOptional({ title: '备注' })
  @IsString()
  @IsOptional()
  remark?: string;

  @ApiPropertyOptional({ title: '状态', enum: ['0', '1'] })
  @IsNumberString()
  @IsOptional()
  status?: '0' | '1';

  @ApiPropertyOptional({ title: '状态' })
  @IsNumber()
  @IsOptional()
  sort?: number;

  @ApiProperty({ title: '字典标签', required: true, maxLength: 36 })
  @IsString()
  fieldsText: string;

  @ApiProperty({ title: '字典值', required: true })
  @IsString()
  fieldsValue: string;
}

/**
 * 字典详情列表
 */
export class DictionaryDetailListDto {
  @ApiProperty({ title: '字典名称', required: true, maxLength: 36 })
  @MaxLength(36)
  dictionaryCode: string;

  @ApiProperty({ title: '备注' })
  @IsOptional()
  remark: string;

  @ApiProperty({ title: '状态', enum: ['0', '1'] })
  @IsOptional()
  status: '0' | '1';

  @ApiProperty({ title: '状态' })
  @IsOptional()
  sort: number;

  @ApiProperty({ title: '字典标签', required: true, maxLength: 36 })
  @IsString()
  fieldsText: string;

  @ApiProperty({ title: '字典值', required: true })
  fieldsValue: string;

  @ApiProperty({ title: 'id' })
  id: number;

  @ApiProperty({ title: 'createAt', required: true })
  createAt: string;
}

/**
 * 修改字典详情
 */
export class PatchDictionaryDetailDto extends PartialType(
  OmitType(CreateDictionaryDetailDto, ['dictionaryCode']),
) {}

/**
 * 字段查询参数
 */
export class QueryDictionaryDetailDto extends IntersectionType(PartialType(QueryPaging)) {
  @ApiProperty({ title: '字典编码', required: true, maxLength: 36 })
  @IsString()
  @MaxLength(36)
  code: string;
}
export class QueryDictionaryIdDetailDto extends IntersectionType(
  QueryDictionaryDetailDto,
  PartialType(PickType(CreateDictionaryDetailDto, ['fieldsText', 'status'])),
) {}
