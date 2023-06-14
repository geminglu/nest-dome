import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserInfo } from './dto/userDto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user-dto';
import { ApiOperation, ApiParam, ApiTags, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { ResUnauthorized, ResServerErrorResponse } from 'src/utils/api.Response';
import { DataSource } from 'typeorm';
import { Roles, Role } from 'src/decorators/roles.decorator';
import { ResultData } from 'src/utils/result';
import { ResCerated } from 'src/utils/api.Response';

@Controller({
  path: 'user',
  version: '1',
})
@ApiTags('用户')
@ResUnauthorized()
@ResServerErrorResponse()
@ApiExtraModels(UserInfo)
export class UserController {
  constructor(private readonly userService: UserService, private dataSource: DataSource) {}

  @Post()
  @ApiOperation({
    summary: '创建用户',
    description: '创建一个新用户仅管理员权限',
  })
  @ApiResponse({
    status: 201,
    description: 'The found record',
  })
  @Roles(Role.Admin)
  async create(@Body() createUser: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // 管理员添加的用户默认密码是‘123456’
      const user = await this.userService.create({ ...createUser, password: '123456' }, queryRunner);
      await queryRunner.commitTransaction();
      return ResultData.ok(user, '创建成功');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return ResultData.fail(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  @Get()
  @ApiOperation({
    summary: '查询用户列表',
    description: '查询用户列表支持分页',
  })
  @Roles(Role.Admin)
  async findAll(@Query() query: QueryUserDto) {
    return ResultData.ok(await this.userService.findAll(query));
  }

  @Get('details')
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiOperation({
    summary: '查询用户详情',
    description: '查询用户详情',
  })
  findOne(@Req() req) {
    return this.userService.findOne(req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '修改用户列表',
    description: '修改查询用户详情',
  })
  update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.update(id, updateUser);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '删除用户列表',
    description: '删除查询用户详情',
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('userInfo')
  @ApiOperation({
    summary: '查询登陆用户详情',
    description: '查询登陆用户详情',
  })
  @ResCerated(UserInfo)
  userInfo(@Req() req) {
    return this.userService.getUserInfo(req.user.id);
  }
}
