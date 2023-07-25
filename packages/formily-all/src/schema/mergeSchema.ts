import { toArr } from '@formily/shared';

import { RuntimeSchema } from './runtimeSchema';
import { FieldEffects } from '../core/effects';

/** 需要进行 schema 合成的 key */
const mergedKeys: (keyof RuntimeSchema)[] = ['x-reactions', 'x-validator', ...(Object.keys(FieldEffects) as any)];

/**
 * 合并 FormilySchema
 * 1. 对 schema 进行浅层合并
 * 2. 对 x-reaction 和 x-validator 进行数组合成
 * 3. 对 FieldEffects 系列值进行数组合成
 * 3. 不对 properties/items 进行递归处理
 */
export function mergeSchema<T extends RuntimeSchema, P extends Partial<RuntimeSchema>>(base: T, ...snips: P[]): T {
  const concatMap: Partial<Record<keyof RuntimeSchema, any[]>> = {};

  let result: T = { ...base };
  snips.forEach((snip) => {
    mergedKeys.forEach((key) => {
      if (snip[key]) {
        const newItems = toArr(snip[key]);
        concatMap[key] = [...toArr(concatMap[key]), ...newItems];
      }
    });
    result = { ...result, ...snip };
  });
  return {
    ...result,
    ...concatMap,
  } as T;
}
