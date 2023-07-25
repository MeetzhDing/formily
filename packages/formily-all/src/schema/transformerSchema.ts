import { map, toArr } from '@formily/shared';
import { Entries, Simplify } from 'type-fest';

import type { FieldEffectSchema, FieldEffectSchemaParam, FieldChangeSchemaParam } from './fieldEffect';
import type { RuntimeSchema } from './runtimeSchema';
import { RuntimeReaction } from './runtimeSchema';
import { FieldEffects } from '../core/effects';
import { runReactionOnce } from '../utility';

/**
 * 深度转化 RuntimeSchema，仅需要在传递给 SchemaField 前处理一次
 * 1. 递归处理 fieldEffects系列字段
 * 2. 已默认在 createSchemaField SchemaField 组件中调用
 */
export function transformerSchema(schema: RuntimeSchema) {
  const result: Simplify<Omit<RuntimeSchema, keyof FieldEffectSchema>> = {};
  const reactions: RuntimeReaction[] = toArr(schema['x-reactions']);

  for (const [key, value] of Object.entries(schema) as Entries<RuntimeSchema>) {
    // 对于每个 FieldEffect key，生成一个 reaction
    if (FieldEffects[key]) {
      const effectParams = toArr(value);
      if (effectParams?.length > 0) {
        const effect: RuntimeReaction = runReactionOnce((field) => {
          effectParams.forEach((param: FieldEffectSchemaParam | FieldChangeSchemaParam) => {
            if (key === 'onFieldChange' && 'watches' in param && Array.isArray(param.watches)) {
              FieldEffects.onFieldChange(param.pattern ?? field.address, param.watches, param.callback);
            } else {
              FieldEffects[key](param.pattern ?? field.address, param.callback);
            }
          });
        });
        Object.defineProperty(effect, 'name', { value: key });
        reactions.push(effect);
      }
      continue;
    }
    switch (key) {
      // 对于 properties/items，递归处理
      case 'properties': {
        result.properties = map(schema.properties as any, transformerSchema) as RuntimeSchema['properties'];
        break;
      }
      case 'items': {
        result.items = map(schema.items as any[], transformerSchema) as RuntimeSchema['items'];
        break;
      }
      case 'x-reactions': {
        break;
      }
      default: {
        result[key] = value;
      }
    }
  }
  result['x-reactions'] = reactions;
  return result;
}
