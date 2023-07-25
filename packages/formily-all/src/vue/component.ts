/* eslint-disable @typescript-eslint/member-ordering */

// Formily 适配组件的类型定义

import type { PropType } from 'vue';
import { defineComponent } from 'vue-demi';

/**
 * Formily 组件 Props 注册值
 * 类型支持请使用 defineComponent 的泛型参数进行定义
 */
export const FormilyComponentPropDefs = ['disabled', 'readOnly', 'value', 'onChange', 'onFocus', 'onBlur'];

/** Formily 组件 Props */
export interface IFormilyComponentProps<Value> {
  // Formily Field 自动填充的属性与事件
  disabled: boolean | undefined;
  readOnly: boolean | undefined;
  /** 当前的 Field.value，不会被外部 ComponentProps 覆盖 */
  value: Value | undefined;

  onChange: (value: Value) => void;
  onFocus: () => void;
  onBlur: () => void;

  // 通用的参数，需要外部在 componentProps 中传递
  style?: any;
  class?: any;
  [key: `@${string}`]: any;
  [key: `on${string}`]: any;
  /** 组件可通过继承定义其他的Props */
  // [key: string]: any;

  /**
   * 可使用 [mapProps](https://vue.formilyjs.org/api/shared/map-props.html) 将 FieldProperties 映射为 组件Props
   * - dataSource 为当前组件的数据源
   * - loading 为当前组件的加载状态
   * - [实现异步数据源](https://formilyjs.org/zh-CN/guide/advanced/async)
   */
  // dataSource?: any
  // loading?: boolean
}

/** Formily 装饰器 Props */
export interface IFormilyDecoratorProps {
  // 通用的参数，需要外部在 decoratorProps 中传递
  style?: any;
  class?: any;
  [key: `@${string}`]: any;
  [key: `on${string}`]: any;
  /** 组件可定义其他的Props */
  [key: string]: any;
}
