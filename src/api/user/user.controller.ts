import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserInfo } from './dto/userDto';
import { UpdateUserDto, UpdateMyUserDto, UpdateMyEmailDto } from './dto/update-user.dto';
import { QueryUserDto, LoginLogReqDto } from './dto/query-user-dto';
import { ApiOperation, ApiParam, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { ResUnauthorized, ResServerErrorResponse } from 'src/utils/api.Response';
import { DataSource } from 'typeorm';
import { Roles, Role } from 'src/decorators/roles.decorator';
import { ResultData } from 'src/utils/result';
import { ConfigService } from '@nestjs/config';
import { ResCerated, ResSuccess } from 'src/utils/api.Response';
import { QueryLogInLog } from 'src/dto';
import { AuthService } from '../auth/auth.service';
import { verifyType } from '../auth/dto/auth.dto';

@Controller({
  path: 'user',
  version: '1',
})
@ApiTags('用户')
@ResUnauthorized()
@ResServerErrorResponse()
@ApiExtraModels(UserInfo, LoginLogReqDto)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private dataSource: DataSource,
    private readonly config: ConfigService,
    private authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '创建用户',
    description: '创建一个新用户仅管理员权限',
  })
  @ResSuccess(UserInfo)
  @Roles(Role.Admin)
  async create(@Body() createUser: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const user = await this.userService.create(
        { ...createUser, password: '123456' },
        queryRunner,
      );
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

  @Patch('info:id')
  @ApiOperation({
    summary: '管理员修改用户列表详情',
    description: '管理员修改查询用户详情',
  })
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.update(id, updateUser);
  }

  @Patch()
  @ApiOperation({
    summary: '修改用户信息',
    description: '修改用户信息',
  })
  @Roles(Role.Admin)
  myUpdate(@Body() updateUser: UpdateMyUserDto, @Req() req) {
    console.log(updateUser);

    return this.userService.update(req.user.id, updateUser);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '删除用户',
    description: '删除用户',
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
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

  @Get('getLoginLog')
  @ApiOperation({
    summary: '查询当前登陆用户的登陆日志',
  })
  @ResSuccess(LoginLogReqDto, true, true)
  logInLog(@Query() query: QueryLogInLog, @Req() req) {
    return this.userService.getLogInLog(query, req.user.id);
  }

  @Get('getLoginLogs')
  @ApiOperation({
    summary: '查询所以用户的登陆日志',
  })
  @Roles(Role.Admin)
  @ResSuccess(LoginLogReqDto, true, true)
  logInLogs(@Query() query: QueryLogInLog) {
    return this.userService.getLogInLog(query);
  }

  @Patch('upEmial')
  @ApiOperation({
    summary: '修改邮箱',
    description: '修改个人邮箱，在修改邮箱之前需要完成旧邮箱地址的验证并带上验证通过的token',
  })
  @ResSuccess()
  async updateEmail(@Body() update: UpdateMyEmailDto, @Req() req) {
    const payload = this.authService.verifyToken(update.token);
    if (req.user.id !== payload.uid) {
      return ResultData.fail('验证失败');
    }
    if (payload.type !== verifyType.UPEMAIL) {
      return ResultData.fail('业务类型不支持');
    }

    return this.userService.update(req.user.id, { email: update.email });
  }
}
