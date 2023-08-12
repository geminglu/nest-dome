import { Controller, Get, Body, Post, Patch, Param, Delete, Req } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiExtraModels, ApiBearerAuth } from '@nestjs/swagger';
import { SystemService } from './system.service';
import { Roles, Role } from 'src/decorators/roles.decorator';
import { ResServerErrorResponse, ResUnauthorized } from 'src/utils/api.Response';
import { ResSuccess, ResCerated } from 'src/utils/api.Response';
import { ResSystemMenuDto, CreateSystemDto, patchSystemDto } from './dto/create-system.dto';

@Controller({
  path: 'system',
  version: '1',
})
@ApiTags('system')
@ApiBearerAuth()
@ApiExtraModels(ResSystemMenuDto)
@ResUnauthorized()
@ResServerErrorResponse()
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @ApiOperation({
    summary: '获取权限菜单',
    description: '只能获取到当前用户授权访问的菜单',
  })
  @Get('permissionMenu')
  @ResSuccess(ResSystemMenuDto, true)
  getPermissionMenu(@Req() req) {
    return this.systemService.getPermissionMenu(req.user.id);
  }

  @ApiOperation({
    summary: '获取系统菜单',
  })
  @Roles(Role.Admin)
  @Get('menu')
  @ResSuccess(ResSystemMenuDto, true)
  getMenu() {
    return this.systemService.findMenu();
  }

  @ApiOperation({
    summary: '创建系统菜单',
  })
  @Roles(Role.Admin)
  @Post('menu')
  @ResCerated(ResSystemMenuDto)
  cerateMenu(@Body() body: CreateSystemDto) {
    return this.systemService.cerateMenu(body);
  }

  @ApiOperation({
    summary: '修改系统菜单',
  })
  @Roles(Role.Admin)
  @Patch('menu/:id')
  @ResSuccess(ResSystemMenuDto)
  editMenu(@Body() body: patchSystemDto, @Param('id') path: string) {
    return this.systemService.editMenu(body, path);
  }

  @ApiOperation({
    summary: '删除系统菜单',
  })
  @Roles(Role.Admin)
  @Delete('menu/:id')
  @ResSuccess()
  delMenu(@Param('id') path: string) {
    console.log(path);
    return this.systemService.deleMenu(path);
  }
}
