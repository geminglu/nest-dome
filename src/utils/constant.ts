import { join } from 'path';

/**
 * 访问静态资源路径前缀
 */
export const STATIC_PATH = '/static';

/**
 * 上传文件目录
 */
export const UP_PATH = join(process.env.UPLOAD_PATH);

/**
 * 静态文件目录
 */
export const STATIC_UP_PATH = join(UP_PATH, 'static');
