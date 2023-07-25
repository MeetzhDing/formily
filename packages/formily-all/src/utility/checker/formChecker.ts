import { Field, Form, isForm } from '@formily/core';
import { Get } from 'type-fest';

import { Checker } from './checker';
import { Queryable } from '../../core';

abstract class FormChecker<FormState = any> extends Checker {
  readonly form: Form;
  private readonly queryable: Queryable;
  protected constructor(queryable: Queryable) {
    super({} as any);
    this.queryable = queryable;
    this.form = isForm(queryable) ? queryable : queryable.form;
  }

  // 根据字段绝对路径，获取Field
  take<Path extends string>(path: Path): Field<Get<FormState, Path>> | undefined {
    return this.queryable.query(path as any).take() as Field;
  }
}

type EnumFieldGetter<V, K extends string | number | symbol = string> = Readonly<{
  field: Field<unknown, unknown, unknown, V> | undefined;
  value: V;
  is: Record<K, boolean>;
  not: Record<K, boolean>;
}>;

type ValueFieldGetter<V> = Readonly<{
  field: Field<unknown, unknown, unknown, V> | undefined;
  value: V;
}>;

const checkerCache = new WeakMap<Form, any>();
/**
 * 注册表单字段信息，获取表单字段检查器。字段检查器可简化判断逻辑代码
 * @param maps.enumMap 枚举形字段信息
 * @param maps.valueMap 复杂值字段信息
 * @return (queryable)=>checker 字段检查器
 */
export function formCheckerBuilder<
  EnumMap extends FormChecker['enumMap'],
  ValueMap extends FormChecker['valueMap'],
>(maps: { enumMap: EnumMap; valueMap: ValueMap }) {
  const { enumMap, valueMap } = maps;
  class InternalChecker extends FormChecker {
    enumMap = enumMap;
    valueMap = valueMap;

    constructor(queryable) {
      super(queryable);
      this.registerGetter();
    }
  }

  return (
    queryable: Queryable,
  ): FormChecker & {
    [key in keyof EnumMap]: EnumFieldGetter<EnumMap[key]['valueType'], keyof EnumMap[key]['enum']>;
  } & {
    [key in keyof ValueMap]: ValueFieldGetter<ValueMap[key]['valueType']>;
  } => {
    const form = isForm(queryable) ? queryable : queryable.form;
    if (checkerCache.has(form)) {
      return checkerCache.get(form);
    }

    const checker = new InternalChecker(form) as any;
    checkerCache.set(form, checker);
    return checker;
  };
}
