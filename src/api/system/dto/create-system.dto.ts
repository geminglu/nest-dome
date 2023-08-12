import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, IsNumberString } from 'class-validator';
import { SystemMenu, SystemMenuHidden } from 'src/types/user';

export class CreateSystemDto {
  @ApiProperty({ title: 'type', enum: SystemMenu })
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  @IsString()
  type: SystemMenu;

  @ApiPropertyOptional({ title: 'icon', description: '如果创建目录icon必填' })
  @IsOptional()
  @IsString()
  icon: string;

  @ApiPropertyOptional({ title: '路由名称', description: '如果是是菜单路由名称就必须存在', maxLength: 10 })
  @MaxLength(10)
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pid?: string;

  @ApiPropertyOptional({ title: '是否隐藏菜单', enum: SystemMenuHidden })
  hidden: SystemMenuHidden;

  @MaxLength(10)
  @ApiProperty({ title: 'title' })
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  @IsString()
  title: string;

  @IsOptional()
  @ApiPropertyOptional({ title: '状态', description: '0:禁用；1:启用' })
  @IsNumberString()
  status?: SystemMenuHidden;
}

export class ResSystemMenuDto extends OmitType(CreateSystemDto, ['hidden']) {
  @ApiProperty({ title: 'id', required: true })
  @IsString()
  id: string;

  @ApiProperty({ title: '是否隐藏菜单', enum: SystemMenuHidden })
  hidden: SystemMenuHidden;

  @ApiProperty({ title: 'createAt', required: true })
  @IsString()
  createAt: string;
}

export class patchSystemDto extends OmitType(CreateSystemDto, ['pid']) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type: SystemMenu;

  @ApiPropertyOptional()
  @MaxLength(10)
  @IsOptional()
  @IsString()
  title: string;
}
