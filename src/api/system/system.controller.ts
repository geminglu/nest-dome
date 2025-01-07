import { Controller, Get, Body, Post, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiExtraModels, ApiBearerAuth } from '@nestjs/swagger';
import { SystemService } from './system.service';
import { Roles, Role } from 'src/decorators/roles.decorator';
import { ResServerErrorResponse, ResUnauthorized } from 'src/utils/api.Response';
import { ResSuccess, ResCerated } from 'src/utils/api.Response';
import {
  ResSystemMenuDto,
  CreateSystemDto,
  patchSystemDto,
  CreateDictionaryDto,
  PatchDictionaryDto,
  DictionaryListDto,
  DictionaryDetailListDto,
  CreateDictionaryDetailDto,
  PatchDictionaryDetailDto,
  QueryBaseDictionaryDto,
  QueryDictionaryDetailDto,
  QueryDictionaryIdDetailDto,
} from './dto/create-system.dto';
import { QueryPaging } from 'src/dto';
import { ResultData } from 'src/utils/result';

@Controller({
  path: 'system',
  version: '1',
})
@ApiTags('system')
@ApiBearerAuth()
@ApiExtraModels(ResSystemMenuDto, DictionaryListDto, DictionaryDetailListDto, QueryPaging)
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
    return this.systemService.deleMenu(path);
  }

  @ApiOperation({
    summary: '获取字典',
  })
  @Get('dictionary')
  @ResSuccess(DictionaryListDto, true, true)
  async getDictionary(@Query() query: QueryBaseDictionaryDto) {
    return ResultData.ok(await this.systemService.findDictionary(query));
  }

  @ApiOperation({
    summary: '创建字典',
  })
  @Post('dictionary')
  @ResCerated(DictionaryListDto)
  async cerateDictionary(@Body() body: CreateDictionaryDto) {
    return ResultData.ok(await this.systemService.cerateDictionary(body));
  }

  /**
   * 修改字典
   */
  @ApiOperation({
    summary: '修改字典',
  })
  @Patch('dictionary/:id')
  @ResSuccess(DictionaryListDto)
  async editDictionary(@Body() body: PatchDictionaryDto, @Param('id') id: number) {
    return ResultData.ok(await this.systemService.patchDictionary(id, body));
  }

  /**
   * 删除字典
   */
  @ApiOperation({
    summary: '删除字典',
  })
  @Delete('dictionary/:id')
  @ResSuccess()
  async delDictionary(@Param('id') id: number) {
    await this.systemService.deleteDictionary(id);
    return ResultData.ok(null, '删除成功');
  }

  /**
   * 获取字典详情
   */
  @ApiOperation({
    summary: '通过获取字典详情',
    description: '只能查询到可用的字典',
  })
  @Get('dictionaryCodeDetails')
  @ResSuccess(DictionaryDetailListDto, true, true)
  async getDictionaryCodeDetails(@Query() query: QueryDictionaryDetailDto) {
    return ResultData.ok(await this.systemService.findDictionaryDetail({ ...query, status: '1' }));
  }

  /**
   * 获取字典详情
   */
  @ApiOperation({
    summary: '通过id获取字典详情',
    description: '可查询到所有的字典',
  })
  @Get('dictionaryAllDetails')
  @ResSuccess(DictionaryDetailListDto, true, true)
  async getDictionaryIdDetails(@Query() query: QueryDictionaryIdDetailDto) {
    return ResultData.ok(await this.systemService.findDictionaryDetail(query));
  }

  /**
   * 创建字典详情
   */
  @ApiOperation({
    summary: '创建字典详情',
  })
  @Post('dictionaryDetails')
  @ResCerated(DictionaryDetailListDto)
  async cerateDictionaryDetails(@Body() body: CreateDictionaryDetailDto) {
    return ResultData.ok(await this.systemService.cerateDictionaryDetails(body));
  }

  /**
   * 修改字典详情
   */
  @ApiOperation({
    summary: '修改字典详情',
  })
  @Patch('dictionaryDetails/:id')
  @ResSuccess(DictionaryDetailListDto)
  async editDictionaryDetails(@Body() body: PatchDictionaryDetailDto, @Param('id') id: number) {
    return ResultData.ok(await this.systemService.patchDictionaryDetails(body, id));
  }

  /**
   * 删除字典详情
   */
  @ApiOperation({
    summary: '删除字典详情',
  })
  @Delete('dictionaryDetails/:id')
  @ResSuccess()
  async delDictionaryDetails(@Param('id') id: number) {
    this.systemService.deleteDictionaryDetails(id);
    return ResultData.ok(null, '删除成功');
  }
}
