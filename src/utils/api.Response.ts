import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  getSchemaPath,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import {
  SchemaObject,
  ReferenceObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

const baseTypeNames = ['String', 'Number', 'Boolean'];
/**
 * 封装 swagger 返回统一结构
 * 支持复杂类型 {  status, message, data }
 * @param status 自定义状态码
 * @param model 返回的 data 的数据类型
 * @param isArray data 是否是数组
 * @param isPager 设置为 true, 则 data 类型为 { list, total, page, pageSize } , false data 类型是纯数组
 */
export const SuccessResponse = <TModel extends Type<any>>(
  status: any,
  model?: TModel,
  isArray?: boolean,
  isPager?: boolean,
) => {
  let items: SchemaObject & Partial<ReferenceObject> = null;
  if (model && baseTypeNames.includes(model.name)) {
    items = { type: model.name.toLocaleLowerCase() };
  } else {
    items = { $ref: getSchemaPath(model) };
  }

  let prop: SchemaObject & Partial<ReferenceObject> = null;
  if (isArray && isPager) {
    prop = {
      type: 'object',
      properties: {
        list: {
          type: 'array',
          items,
        },
        total: {
          type: 'number',
          default: 0,
        },
        page: {
          type: 'number',
          default: 1,
        },
        pageSize: {
          type: 'number',
          default: 10,
        },
      },
      required: ['list', 'total', 'page', 'pageSize'],
    };
  } else if (isArray) {
    prop = {
      type: 'array',
      items,
    };
  } else if (model) {
    prop = items;
  } else {
    prop = { type: 'null', default: null };
  }

  return applyDecorators(
    status({
      schema: {
        allOf: [
          {
            type: 'object',
            properties: {
              data: prop,
              message: {
                type: 'string',
                default: '',
              },
              success: {
                type: 'boolean',
                default: true,
              },
            },
            required: ['success'],
          },
        ],
      },
    }),
  );
};

/**
 * 成功状态的返回结构
 * @param model 返回的 data 的数据类型
 * @param isArray data 是否是数组
 * @param isPager 设置为 true, 则 data 类型为 { list, total, page, pageSize } , false data 类型是纯数组
 */
export const ResSuccess = <TModel extends Type<any>>(
  model?: TModel,
  isArray?: boolean,
  isPager?: boolean,
) => {
  return SuccessResponse(ApiOkResponse, model, isArray, isPager);
};

/**
 * 创建成功的返回结构
 * @param model 返回的 data 的数据类型
 * @param isArray data 是否是数组
 * @param isPager 设置为 true, 则 data 类型为 { list, total, page, pageSize } , false data 类型是纯数组
 */
export const ResCerated = <TModel extends Type<any>>(
  model?: TModel,
  isArray?: boolean,
  isPager?: boolean,
) => {
  return SuccessResponse(ApiCreatedResponse, model, isArray, isPager);
};

/**
 * 服务器出错的返回结构
 */
export const ResServerErrorResponse = () => {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      description: '服务器错误',
      schema: {
        allOf: [
          {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                default: 'server error',
              },
              success: {
                type: 'boolean',
                default: false,
              },
            },
            required: ['success', 'message'],
          },
        ],
      },
    }),
  );
};

export const ResUnauthorized = () => {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: '未认证',
      schema: {
        allOf: [
          {
            properties: {
              message: {
                type: 'string',
                default: '请先登陆',
              },
              success: {
                type: 'boolean',
                default: false,
              },
            },
            required: ['success', 'message'],
          },
        ],
      },
    }),
  );
};

/**
 * 响应stream
 */
export const ResStream = () => {
  return ApiResponse({
    status: 200,
    description: '成功下载文件',
    content: {
      'application/octet-stream': {},
    },
  });
};
