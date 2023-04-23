/**
 * 验证手机号
 * @param phone
 * @returns
 */
export function validPhone(phone: string): boolean {
  const regx = /^1[2-9]{1}[0-9]{9}$/;
  return regx.test(phone);
}

/**
 *
 * @param email 验证邮箱
 * @returns
 */
export function validEmail(email: string): boolean {
  const regx = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return regx.test(email);
}
