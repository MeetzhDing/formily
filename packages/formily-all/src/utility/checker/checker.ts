import { Get } from 'type-fest'
import { get } from 'lodash-es'

export abstract class Checker<State = any> {
  private readonly state: State
  protected constructor(state: State) {
    this.state = state
  }

  // 根据字段绝对路径，获取值包裹
  take<Path extends string>(
    path: Path
  ): { value: Get<State, Path> } | undefined {
    const value = get(this.state, path) as any
    return { value }
  }

  protected abstract enumMap: Record<
    string,
    { path: string; valueType: any; enum: any } // 枚举类型
    // | { computed?: () => any; enum: any } // 计算属性枚举类型
  >

  protected abstract valueMap: Record<
    string,
    { path: string; valueType: any } // 非枚举类型
    // | { computed?: () => any; valueType: any } // 计算属性非枚举类型
  >

  protected registerGetter() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    for (const [key, info] of Object.entries({
      ...this.enumMap,
      ...this.valueMap,
    })) {
      const path = info.path
      this[key] = {
        get field() {
          return that.take(path) as any
        },
        get value() {
          const field = that.take(path) as any
          return field?.value
        },
        is:
          'enum' in info &&
          (new Proxy(
            {},
            {
              get(target, prop) {
                if (!info.enum) {
                  return false
                }
                return that[key].value === info.enum[prop]
              },
            }
          ) as any),
        not:
          'enum' in info &&
          new Proxy(
            {},
            {
              get(target, prop) {
                if (!info.enum) {
                  return false
                }
                return that[key].value !== info.enum[prop]
              },
            }
          ),
      }
    }
  }
}

type EnumFieldGetter<
  V,
  K extends string | number | symbol = string
> = Readonly<{
  field: { value: V } | undefined
  value: V
  is: Record<K, boolean>
  not: Record<K, boolean>
}>

type ValueFieldGetter<V> = Readonly<{
  field: { value: V } | undefined
  value: V
}>

const checkerCache = new WeakMap<object, any>()
/**
 * 注册纯值对象检查器，简化判断逻辑代码
 */
export function checkerBuilder<
  EnumMap extends Checker['enumMap'],
  ValueMap extends Checker['valueMap']
>(maps: { enumMap: EnumMap; valueMap: ValueMap }) {
  const { enumMap, valueMap } = maps
  class InternalChecker extends Checker {
    constructor(state) {
      super(state)
      this.registerGetter()
    }
    enumMap = enumMap
    valueMap = valueMap
  }

  return (
    state: object
  ): Checker & {
    [key in keyof EnumMap]: EnumFieldGetter<
      EnumMap[key]['valueType'],
      keyof EnumMap[key]['enum']
    >
  } & {
    [key in keyof ValueMap]: ValueFieldGetter<ValueMap[key]['valueType']>
  } => {
    if (checkerCache.has(state)) {
      return checkerCache.get(state)
    }

    const checker = new InternalChecker(state) as any
    checkerCache.set(state, checker)
    return checker
  }
}
