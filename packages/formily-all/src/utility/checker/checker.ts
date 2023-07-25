/* eslint-disable @typescript-eslint/ban-types */
import { get } from 'lodash-es';
import { Get } from 'type-fest';

/**
 * 数据值检测工具。通过注册字段来实现便捷的真假判断，专注原子判断，不做逻辑组合。
 *
 * API 设计上，参考 jest Expect.
 */
export abstract class Checker<State = any> {
  private readonly state: State;

  protected abstract enumMap: Record<
    string,
    { path: string; valueType: any; enum: any } // 枚举类型
    // | { computed?: () => any; enum: any } // 计算属性枚举类型
  >;

  protected abstract valueMap: Record<
    string,
    { path: string; valueType: any } // 非枚举类型
    // | { computed?: () => any; valueType: any } // 计算属性非枚举类型
  >;

  protected constructor(state: State) {
    this.state = state;
  }

  // 根据字段绝对路径，获取值包裹
  take<Path extends string>(path: Path): { value: Get<State, Path> } | undefined {
    const value = get(this.state, path) as any;
    return { value };
  }

  protected registerGetter() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    for (const [key, info] of Object.entries({
      ...this.enumMap,
      ...this.valueMap,
    })) {
      const path = info.path;
      this[key] = {
        get field() {
          return that.take(path) as any;
        },
        get value() {
          const field = that.take(path) as any;
          return field?.value;
        },
        is:
          'enum' in info &&
          (new Proxy(
            {},
            {
              get(target, prop) {
                if (!info.enum) {
                  return false;
                }
                return that[key].value === info.enum[prop];
              },
            },
          ) as any),
        not:
          'enum' in info &&
          new Proxy(
            {},
            {
              get(target, prop) {
                if (!info.enum) {
                  return false;
                }
                return that[key].value !== info.enum[prop];
              },
            },
          ),
        get beTruthy(): boolean {
          return !!that[key].value;
        },
      };
    }
  }
}

type EnumFieldGetter<V, K extends string | number | symbol = string> = Readonly<{
  field: { value: V } | undefined;
  value: V;
  is: Record<K, boolean>;
  not: Record<K, boolean>;
}>;

type ValueFieldGetter<V> = Readonly<{
  field: { value: V } | undefined;
  value: V;
  /** https://jestjs.io/zh-Hans/docs/expect#tobetruthy */
  beTruthy: boolean;
}>;

const checkerCache = new WeakMap<object, any>();
/**
 * 注册纯值对象检查器，简化判断逻辑代码
 *
 * @param maps.enumMap 枚举类型
 * @param maps.booleanMap 布尔类型
 * @param maps.valueMap 非枚举类型
 */
export function checkerBuilder<EnumMap extends Checker['enumMap'], ValueMap extends Checker['valueMap']>(maps: {
  enumMap: EnumMap;
  valueMap: ValueMap;
}) {
  const { enumMap, valueMap } = maps;
  class InternalChecker extends Checker {
    enumMap = enumMap;
    valueMap = valueMap;

    constructor(state) {
      super(state);
      this.registerGetter();
    }
  }

  return (
    state: object,
  ): Checker & {
    [key in keyof EnumMap]: EnumFieldGetter<EnumMap[key]['valueType'], keyof EnumMap[key]['enum']>;
  } & {
    [key in keyof ValueMap]: ValueFieldGetter<ValueMap[key]['valueType']>;
  } => {
    if (checkerCache.has(state)) {
      return checkerCache.get(state);
    }

    const checker = new InternalChecker(state) as any;
    checkerCache.set(state, checker);
    return checker;
  };
}
