import { ApiProperty } from '@nestjs/swagger';
export class ResultData {
  constructor(success = true, message?: string, data?: any) {
    this.message = message || '';
    this.data = data ?? null;
    this.success = success;
  }

  @ApiProperty({ type: 'string', default: '' })
  message?: string;

  @ApiProperty()
  data?: any;

  @ApiProperty({ type: 'boolean' })
  success: boolean;

  /**
   * 成功
   * @param data 响应主体
   * @param message 内容描述
   * @returns
   */
  static ok(data?: any, message?: string): ResultData {
    return new ResultData(true, message, data);
  }

  /**
   *失败
   * @param message 失败描述
   * @param data 响应主体
   * @returns
   */
  static fail(message?: string, data?: any): ResultData {
    return new ResultData(false, message, data);
  }
}
