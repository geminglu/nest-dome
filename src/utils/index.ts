export function handelPaging(skip: number = 1, take: number = 100) {
  if (skip < 1) {
    throw new Error('skip must not be less than 1');
  }
  if (take < 1) {
    throw new Error('take must not be less than 1');
  }
  return { skip: (skip - 1) * take, take };
}

/**
 * 生成随机字符串
 * @param {number} [minLength=16] - 最小长度，默认16
 * @param {number} [maxLength=16] - 最大长度，默认16
 * @param {Set} [existingStrings] - 已存在的字符串集合，用于防止重复
 * @returns {string} 生成的随机字符串
 */
export function generateRandomString(
  minLength: number = 16,
  maxLength: number = 16,
  existingStrings = new Set(),
) {
  // 验证参数
  if (minLength < 1 || maxLength < 1) {
    throw new Error('长度必须大于0');
  }
  if (minLength > maxLength) {
    throw new Error('最小长度不能大于最大长度');
  }

  // 确定实际长度
  const length =
    minLength === maxLength
      ? minLength
      : Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  // 字符集
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specials = '-_!@';

  let result: string;
  let attempts = 0;
  const maxAttempts = 100; // 防止无限循环

  do {
    // 确保每种类型至少有一个字符（除了特殊字符，可以0个）
    const chars: string[] = [];

    // 确保至少一个小写字母
    chars.push(lowercase[Math.floor(Math.random() * lowercase.length)]);

    // 确保至少一个大写字母
    chars.push(uppercase[Math.floor(Math.random() * uppercase.length)]);

    // 确保至少一个数字
    chars.push(numbers[Math.floor(Math.random() * numbers.length)]);

    // 随机决定是否包含特殊字符（0到3个）
    const specialCount = Math.floor(Math.random() * 4); // 0到3个
    for (let i = 0; i < specialCount; i++) {
      chars.push(specials[Math.floor(Math.random() * specials.length)]);
    }

    // 填充剩余长度
    const allChars = lowercase + uppercase + numbers + specials;
    while (chars.length < length) {
      chars.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // 打乱字符顺序
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    result = chars.join('');

    attempts++;
    if (attempts >= maxAttempts) {
      throw new Error('无法生成不重复的字符串，尝试次数过多');
    }
  } while (existingStrings.has(result));

  return result;
}
