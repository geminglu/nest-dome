export interface ResultType<T = any> {
  /** 状态 */
  success: boolean;
  /** 数据 */
  data?: T;
  /** 接口信息 */
  message?: string;
}
