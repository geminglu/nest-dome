export function handelPaging(skip: number = 1, take: number = 100) {
  if (skip < 1) {
    throw new Error('skip must not be less than 1');
  }
  if (take < 1) {
    throw new Error('take must not be less than 1');
  }
  return { skip: (skip - 1) * take, take };
}
