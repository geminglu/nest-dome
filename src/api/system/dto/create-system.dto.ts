import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, IsNumberString } from 'class-validator';
import { SystemMenuHidden } from 'src/types/user';

export class CreateSystemDto {
  @ApiPropertyOptional({ title: 'icon', description: '如果创建目录icon必填' })
  @IsOptional()
  @IsString()
  icon: string;

  @ApiPropertyOptional({
    title: '路由名称',
    description: '如果是是菜单路由名称就必须存在',
    maxLength: 10,
  })
  @MaxLength(10)
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pid: string;

  @ApiProperty({ title: '是否隐藏菜单', enum: SystemMenuHidden })
  hidden: SystemMenuHidden;

  @MaxLength(10)
  @ApiProperty({ title: 'title' })
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  @IsString()
  title: string;

  @IsOptional()
  @ApiProperty({ title: '状态', description: '0:禁用；1:启用' })
  @IsNumberString()
  status?: SystemMenuHidden;

  @MaxLength(100)
  @IsNotEmpty({
    message: () => `path不能为空，如果是跟节点或叶子节点请讲 path 设置为子节点的 path`,
    always: true,
  })
  @IsString()
  @ApiPropertyOptional({ title: '路由地址', description: '如果是菜单必传', maxLength: 10 })
  path?: string;
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
