import type { OmitIndexSignature, Simplify } from 'type-fest'
import type { IScopeContext, SchemaKey, SchemaEnum } from '@formily/json-schema'
import type {
  Form,
  Field,
  ArrayField,
  ObjectField,
  VoidField,
  JSXComponent,
} from '@formily/core'
import type {
  IValidatorRules,
  ValidatorFormats,
  ValidatorFunctionResponse,
} from '@formily/validator'
import type { FieldEffectSchema } from './fieldEffect'

// 字面量类型定义
export type SchemaTypes =
  | 'string'
  | 'object'
  | 'array'
  | 'number'
  | 'boolean'
  | 'void'
  | 'date'
  | 'datetime'
export type FieldDisplayStrict = 'none' | 'hidden' | 'visible'
export type FieldPatternStrict =
  | 'editable'
  | 'readOnly'
  | 'disabled'
  | 'readPretty'

/** Field 类型定义包装 */
export type RuntimeField<
  ValueType = any,
  Decorator extends JSXComponent = any,
  Component extends JSXComponent = any,
  TextType = any
> = ValueType extends undefined | null | void
  ? VoidField<Decorator, Component>
  :
      | Field<Decorator, Component, TextType, ValueType>
      | ObjectField<Decorator, Component>
      | ArrayField<Decorator, Component>

/** Schema 响应式声明，允许通过泛型参数获取到Field类型 */
export type RuntimeReaction<ReactionField extends RuntimeField = RuntimeField> =
  (field: ReactionField, scope: IScopeContext) => void

/** Schema 校验函数声明，支持校验字段值类型 */
export type RuntimeValidator<
  Value = any,
  Context = RuntimeValidatorContext<Value>
> =
  | ValidatorFormats
  | RuntimeValidatorFunction<Value, Context>
  | Simplify<
      SimpleMerge<
        IValidatorRules<any>,
        { validator: RuntimeValidatorFunction<Value, Context> }
      >
    >

export type RuntimeValidatorFunction<
  Value = any,
  Context = RuntimeValidatorContext<Value>
> = (
  value: Value,
  rule: IValidatorRules<any>,
  ctx: Context,
  render: (message: string, scope?: any) => string
) => ValidatorFunctionResponse | Promise<ValidatorFunctionResponse> | null

type RuntimeValidatorContext<Value> = Simplify<
  SimpleMerge<
    IValidatorRules<any>,
    { form?: Form; field?: Field<any, any, any, Value>; value?: Value }
  >
>

type Message = any
/**
 * 常规 Field Schema 定义
 *
 * 部分 Schema 字段将直接被转化为 Field 属性值，参考 [SchemaStateMap](https://github.com/alibaba/formily/blob/bc90d7b25b2bfe5d872e058afe1ad5e1611e09bc/packages/json-schema/src/shared.ts#L20)
 */
export type FieldSchema<
  Value = any,
  Decorator = any,
  Component = any,
  DecoratorProps = any,
  ComponentProps = any
> = {
  name?: SchemaKey
  title?: Message
  description?: Message
  default?: any
  readOnly?: boolean
  writeOnly?: boolean
  type?: Exclude<SchemaTypes, 'void'>
  /** 默认的 field dataSource */
  enum?: SchemaEnum<Message>

  // JSON Schema校验相关逻辑
  const?: any
  multipleOf?: number
  maximum?: number
  exclusiveMaximum?: number
  minimum?: number
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  pattern?: string | RegExp
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  maxProperties?: number
  minProperties?: number
  required?: string[] | boolean | string
  format?: string
  $ref?: string
  $namespace?: string

  properties?: Record<string, RuntimeSchema>
  items?: RuntimeSchema[]

  ['x-value']?: Value
  //字段顺序
  ['x-index']?: number
  //交互模式
  ['x-pattern']?: FieldPatternStrict
  //展示状态
  ['x-display']?: FieldDisplayStrict
  //校验器
  ['x-validator']?: RuntimeValidator<Value> | RuntimeValidator<Value>[]
  //装饰器
  ['x-decorator']?: Decorator | (string & {}) | ((...args: any[]) => any)
  //装饰器属性
  ['x-decorator-props']?: DecoratorProps
  //组件
  ['x-component']?: Component | (string & {}) | ((...args: any[]) => any)
  //组件属性
  ['x-component-props']?: ComponentProps

  /**
   * 组件响应器，在 field 初始化生命周期前执行。
   * 1. 函数内部读取响应式值，值变更时借助 autorun 重运行
   * 2. 可在内部使用 [FieldEffects](https://core.formilyjs.org/zh-CN/api/entry/field-effect-hooks) 注册字段生命周期事件
   * 3. 可在内部使用 [FormEffects](https://core.formilyjs.org/zh-CN/api/entry/field-effect-hooks) 注册表单生命周期事件
   */
  ['x-reactions']?:
    | RuntimeReaction<RuntimeField<Value, Decorator, Component, any>>
    | RuntimeReaction<RuntimeField<Value, Decorator, Component, any>>[]

  /** 组件children, 参考如何使用插槽(https://vue.formilyjs.org/questions/) */
  ['x-content']?: any
  /** 字段模型拓展状态(https://github.com/alibaba/formily/discussions/1590) */
  ['x-data']?: any
  ['x-visible']?: boolean
  ['x-hidden']?: boolean
  ['x-disabled']?: boolean
  ['x-editable']?: boolean
  ['x-read-only']?: boolean
  ['x-read-pretty']?: boolean
} & FieldEffectSchema

/** Void Schema 定义 */
export type VoidSchema<
  Decorator = any,
  Component = any,
  DecoratorProps = any,
  ComponentProps = any
> = Simplify<
  SimpleMerge<
    {
      type?: 'void'
      ['x-reactions']?:
        | RuntimeReaction<RuntimeField<void, Decorator, Component, any>>
        | RuntimeReaction<RuntimeField<void, Decorator, Component, any>>[]
    },
    Omit<
      FieldSchema<void, Decorator, Component, DecoratorProps, ComponentProps>,
      | 'type'
      | 'x-value'
      | 'x-reactions'
      | keyof Omit<OmitIndexSignature<IValidatorRules>, 'pattern'>
    >
  >
>

/** 支持运行时函数的严格的 Schema 定义 */
export type RuntimeSchema<
  Value = any,
  Decorator = any,
  Component = any,
  DecoratorProps = any,
  ComponentProps = any
> = Value extends undefined | null | void
  ? VoidSchema<Decorator, Component, DecoratorProps, ComponentProps>
  : FieldSchema<Value, Decorator, Component, DecoratorProps, ComponentProps>
