import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UsePipes,
  Res,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user-dto';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiResponse,
  ApiHeader,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import { Roles, Role } from 'src/decorators/roles.decorator';

@Controller({
  path: 'user',
  version: '1',
})
@ApiTags('用户')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: '创建用户',
    description: '创建一个新用户',
  })
  @ApiCreatedResponse({
    description: 'The found record',
  })
  @Roles(Role.Admin)
  create(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }

  @Post('register')
  @ApiOperation({
    summary: '注册账号',
  })
  register(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }

  @Get()
  @ApiOperation({
    summary: '查询用户列表',
    description: '查询用户列表支持分页',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
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
}
