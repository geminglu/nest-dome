import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { DeptService } from './dept.service';
import { DeptDtoInfo, CreateDeptDto, UpdateDeptDto, QueryDeptDto } from '../dto/dept.dto';
import { Role, Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import {
  ResCerated,
  ResServerErrorResponse,
  ResSuccess,
  ResUnauthorized,
} from 'src/utils/api.Response';
import { ResultData } from 'src/utils/result';

@Controller({ path: 'system', version: '1' })
@ApiTags('dept')
@ApiExtraModels(DeptDtoInfo)
@ApiBearerAuth()
@ResUnauthorized()
@ResServerErrorResponse()
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @ApiOperation({
    summary: '创建部门',
  })
  @Roles(Role.Admin)
  @Post('dept')
  @ResCerated(DeptDtoInfo)
  async create(@Body() createDeptDto: CreateDeptDto, @Req() req) {
    return ResultData.ok(await this.deptService.create(createDeptDto, req.user.id));
  }

  @ApiOperation({
    summary: '查询部门列表',
  })
  @ResSuccess(DeptDtoInfo, true, true)
  @Roles(Role.Admin)
  @Get('dept')
  async findAll(@Query() query: QueryDeptDto) {
    return ResultData.ok(await this.deptService.findAll(query));
  }

  @ApiOperation({
    summary: '查询部门信息',
  })
  @ResSuccess(DeptDtoInfo)
  @Roles(Role.Admin)
  @Get('dept/:id')
  @ApiParam({
    name: 'id',
    description: '部门ID',
  })
  async findOne(@Param('id') id: string) {
    return ResultData.ok(await this.deptService.findOne(+id));
  }

  @ApiOperation({
    summary: '更新部门信息',
  })
  @ResSuccess(DeptDtoInfo)
  @Roles(Role.Admin)
  @Patch('dept/:id')
  @ApiParam({
    name: 'id',
    description: '部门ID',
  })
  async update(@Param('id') id: string, @Body() updateDeptDto: UpdateDeptDto, @Req() req) {
    return ResultData.ok(
      await this.deptService.update(+id, { ...updateDeptDto, userId: req.user.id }),
    );
  }

  @ApiOperation({
    summary: '删除部门',
  })
  @Roles(Role.Admin)
  @Delete('dept/:id')
  @ApiParam({
    name: 'id',
    description: '部门ID',
  })
  async remove(@Param('id') id: string) {
    await this.deptService.remove(+id);
    return ResultData.ok();
  }
}
