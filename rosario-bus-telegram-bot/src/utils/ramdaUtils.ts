import { prepend, take, drop, isEmpty } from 'ramda';

export const groupsOf = function group<T>(n: number, list: T[]): T[][] {
  return isEmpty(list) ? [] : prepend(take(n, list), group(n, drop(n, list)));
};
