import { Controller, Get, Body, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiExtraModels, ApiBearerAuth } from '@nestjs/swagger';
import { SystemService } from './system.service';
import { Roles, Role } from 'src/decorators/roles.decorator';
import { ResServerErrorResponse, ResUnauthorized } from 'src/utils/api.Response';
import { ResSuccess, ResCerated } from 'src/utils/api.Response';
import { ResSystemMenuDto, CreateSystemDto } from './dto/create-system.dto';

@Controller({
  path: 'system',
  version: '1',
})
@ApiTags('system')
@ApiBearerAuth()
@ApiExtraModels(ResSystemMenuDto)
@Roles(Role.Admin)
@ResUnauthorized()
@ResServerErrorResponse()
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @ApiOperation({
    summary: '获取系统菜单',
  })
  @Get('menu')
  @ResSuccess(ResSystemMenuDto, true)
  getMenu() {
    return this.systemService.findMenu();
  }

  @ApiOperation({
    summary: '创建系统菜单',
  })
  @Post('menu')
  @ResCerated(ResSystemMenuDto)
  cerateMenu(@Body() body: CreateSystemDto) {
    return this.systemService.cerateMenu(body);
  }
}
