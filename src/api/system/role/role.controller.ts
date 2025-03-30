import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, QueryDeptDto, RoleInfoDto, UpdateRoleDto } from '../dto/role.dto';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  ResCerated,
  ResServerErrorResponse,
  ResSuccess,
  ResUnauthorized,
} from 'src/utils/api.Response';
import { Role, Roles } from 'src/decorators/roles.decorator';
import { ResultData } from 'src/utils/result';

@Controller({ path: 'system', version: '1' })
@ApiTags('role')
@ApiExtraModels(RoleInfoDto, QueryDeptDto)
@ApiBearerAuth()
@ResUnauthorized()
@ResServerErrorResponse()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({
    summary: '创建角色',
  })
  @Roles(Role.Admin)
  @Post('role')
  @ResCerated(RoleInfoDto)
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      const result = await this.roleService.create(createRoleDto);
      return ResultData.ok(result);
    } catch (error: any) {
      return ResultData.fail(error.message);
    }
  }

  @Get('role')
  @ApiOperation({
    summary: '查询角色列表',
  })
  @ResSuccess(RoleInfoDto, true, true)
  @Roles(Role.Admin)
  async findAll(@Query() query: QueryDeptDto) {
    return ResultData.ok(await this.roleService.findAll(query));
  }

  @Get('role/:id')
  @ApiOperation({
    summary: '查询角色详情',
  })
  @ApiParam({
    name: 'id',
    description: '角色ID',
  })
  @ResSuccess(RoleInfoDto)
  @Roles(Role.Admin)
  async findOne(@Param('id') id: number) {
    return ResultData.ok(await this.roleService.findOne(id));
  }

  @Patch('role/:id')
  @ApiOperation({
    summary: '更新角色详情',
  })
  @ApiParam({
    name: 'id',
    description: '角色ID',
  })
  @ResSuccess(RoleInfoDto)
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      const data = await this.roleService.update(+id, updateRoleDto);
      return ResultData.ok(data);
    } catch (error: any) {
      return ResultData.fail(error.message);
    }
  }

  @ApiOperation({
    summary: '删除角色',
  })
  @Roles(Role.Admin)
  @ApiParam({
    name: 'id',
    description: '角色ID',
  })
  @ResSuccess()
  @Delete('role/:id')
  async remove(@Param('id') id: number) {
    try {
      const data = await this.roleService.remove(id);
      return ResultData.ok(data);
    } catch (error) {
      return ResultData.fail(error.message);
    }
  }
}
