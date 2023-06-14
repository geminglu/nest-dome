import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SystemMenu, SystemMenuHidden } from 'src/types/user';

export class CreateSystemDto {
  @ApiProperty({ title: 'type', enum: SystemMenu })
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  @IsString()
  type: SystemMenu;

  @ApiProperty({ title: 'icon' })
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  @IsString()
  icon: string;

  @ApiPropertyOptional({ title: '路由名称', description: '如果是是菜单路由名称就必须存在' })
  name: string;

  @ApiPropertyOptional()
  pid: string;

  @ApiPropertyOptional({ title: '是否隐藏菜单', enum: SystemMenuHidden })
  hidden: SystemMenuHidden;

  @ApiProperty({ title: 'title' })
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  @IsString()
  title: string;
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
