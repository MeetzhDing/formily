import { Form, FormPathPattern, GeneralField, IFieldState } from '@formily/core'

// 在 Schema 中直接定义 Field Hook
export type FieldEffectSchemaParam = {
  // 当不提供 pattern 时，直接使用当前 field.address
  pattern?: FormPathPattern
  callback?: (field: GeneralField, form: Form) => void
}

export type FieldChangeSchemaParam = {
  pattern?: FormPathPattern
  watches: (keyof IFieldState)[]
  callback?: (field: GeneralField, form: Form) => void
}

export type FieldEffectSchema = Partial<{
  /** 字段初始化，每个字段只会初始化一次 */
  onFieldInit: FieldEffectSchemaParam | FieldEffectSchemaParam[]
  /** 字段渲染器层级挂载（field.display 为 none,hidden 时，也会执行，但其子节点不会执行） */
  onFieldMount: FieldEffectSchemaParam | FieldEffectSchemaParam[]
  /** 字段渲染器层级卸载（field.display 为 none,hidden 时，也会执行，但其子节点不会执行） */
  onFieldUnmount: FieldEffectSchemaParam | FieldEffectSchemaParam[]
  /** 监听某个字段默认值变化(setInitialValue) */
  onFieldInitialValueChange: FieldEffectSchemaParam | FieldEffectSchemaParam[]
  /** 监听某个字段 onInput 触发(从组件内部onChange/调用field.onInput方法) */
  onFieldInputValueChange: FieldEffectSchemaParam | FieldEffectSchemaParam[]
  /** 监听某个字段校验触发开始 */
  onFieldValidateStart: FieldEffectSchemaParam | FieldEffectSchemaParam[]
  /** 监听某个字段校验触发结束 */
  onFieldValidateEnd: FieldEffectSchemaParam | FieldEffectSchemaParam[]
  /** 监听某个字段校验触发失败 */
  onFieldValidateFailed: FieldEffectSchemaParam | FieldEffectSchemaParam[]
  /** 监听某个字段校验触发成功 */
  onFieldValidateSuccess: FieldEffectSchemaParam | FieldEffectSchemaParam[]
  /** 监听某个字段的值变化(setValue/onInput) */
  onFieldValueChange: FieldEffectSchemaParam | FieldEffectSchemaParam[]

  /**
   * 在字段初始化后，注册 autorun 回调，使用当前 field.pattern 时基本等同于 x-reactions 逻辑
   *
   * 使用场景是当前字段 **依赖未初始化的其他字段时**，注册其他字段的 x-reactions 逻辑。
   *
   * 内部实现为 onFieldInit + autorun
   */
  onFieldReact:
    | Required<FieldEffectSchemaParam>
    | Required<FieldEffectSchemaParam>[]
  /**
   * 监听某个字段的属性变化，watches 取值为 keyof IFieldState，默认为监听 value 变化
   *
   * 此方法有额外的 watches 参数，如果无需特殊监听，推荐使用 onFieldValueChange
   *
   * 内部实现为 onFieldInit + reaction on watches
   */
  onFieldChange: FieldChangeSchemaParam | FieldChangeSchemaParam[]
}>
