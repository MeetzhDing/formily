import { isVoidSchema } from './guard';
import type { FieldSchema, RuntimeSchema, VoidSchema } from './runtimeSchema';
import { SchemaTypes } from './runtimeSchema';

/**
 * 声明 Schema 辅助函数
 *
 * Schema 是 Formily整体逻辑的一种抽象表达，是配置化声明的业务状态与依赖关系。
 */
export function defineSchema<
  Value = any,
  SType extends SchemaTypes = SchemaTypes,
  Decorator = any,
  Component = any,
  DecoratorProps = any,
  ComponentProps = any,
  Schema = SType extends 'void' | void | undefined
    ? VoidSchema<Decorator, Component, DecoratorProps, ComponentProps>
    : FieldSchema<Value, SType, Decorator, Component, DecoratorProps, ComponentProps>,
>(schema: { type?: SType; 'x-value'?: Value } & Schema) {
  if (isVoidSchema(schema as unknown as RuntimeSchema)) {
    return schema as VoidSchema<Decorator, Component, DecoratorProps, ComponentProps>;
  }
  return schema as FieldSchema<Value, SType, Decorator, Component, DecoratorProps, ComponentProps>;
}
