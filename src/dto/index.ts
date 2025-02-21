import { IsArray, IsIn, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type, plainToInstance } from 'class-transformer';

export class QueryPaging {
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: '分页大小', required: true, minimum: 1 })
  pageSize: number;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: '页码', required: true, minimum: 1 })
  page: number;
}

export class SortOrder {
  @ApiProperty({
    description: '排序字段规则',
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  @IsIn(['asc', 'desc'])
  @IsNotEmpty()
  order: 'asc' | 'desc';

  @ApiProperty({
    description: '排序字段',
  })
  @IsString()
  @IsNotEmpty()
  prop: string;
}

// 主 DTO 类
export class SortOrdersDto {
  @ApiProperty({
    description: '排序',
    isArray: true,
    type: SortOrder,
  })
  @IsArray() // 确保是一个数组
  @ValidateNested({ each: true }) // 确保数组中的每个元素都经过验证
  @Type(() => SortOrder) // 使用 class-transformer 将数组元素转换为 SortOrder 实例
  sort: SortOrder[];
}

export class QuerySortOrdersDto {
  @ApiProperty({
    description: '排序',
    type: String,
    example: 'name:asc,email:desc',
  })
  @ValidateNested({ each: true })
  @Transform(
    ({ value }: TransformFnParams) => {
      if (typeof value !== 'string') {
        // 如果 value 是字符串，直接返回
        throw new Error('sort is not string');
      }
      const obj = value
        .split(',')
        .filter((item) => item)
        .map((item) => {
          const [prop, order] = item.split(':');
          return { prop, order };
        });
      return plainToInstance(SortOrder, obj);
    },
    { toClassOnly: true },
  )
  sort: SortOrder[];
}
