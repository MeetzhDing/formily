import type { FieldSchema, VoidSchema } from './runtimeSchema'
import { isVoidSchema } from './guard'

/**
 * 声明 Schema 辅助函数
 *
 * Schema 是 Formily整体逻辑的一种抽象表达，是配置化声明的业务状态与依赖关系。
 */
export function defineSchema<
  Value = any,
  Decorator = any,
  Component = any,
  DecoratorProps = any,
  ComponentProps = any
>(
  schema:
    | VoidSchema<Decorator, Component, DecoratorProps, ComponentProps>
    | FieldSchema<Value, Decorator, Component, DecoratorProps, ComponentProps>
) {
  if (isVoidSchema(schema)) {
    return schema as VoidSchema<
      Decorator,
      Component,
      DecoratorProps,
      ComponentProps
    >
  }
  return schema as FieldSchema<
    Value,
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps
  >
}
