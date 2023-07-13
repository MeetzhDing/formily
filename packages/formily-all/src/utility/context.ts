import { observable } from '@formily/reactive'
import { Form, isForm } from '@formily/core'
import { Queryable } from '../core'

const contextMapStore = new WeakMap<Form, Record<string, { value: any }>>()
/**
 * Form全局响应式维护，用于共享全局型 数据/状态/方法
 * 相关讨论：https://github.com/alibaba/formily/discussions/2431
 * - 官方意见是对于 reactive context，完全可做到不耦合表单实例
 * - 使用方通常会倾向于直接挂载在 form 实例上，方便创建/读取
 *
 * 目前采用以 Form 为 key 的形式存储数据
 *    ① context 消费的泛型支持
 *    ② schema 代码的不同表单间重用
 *    ③ 多个 context 组合场景
 */
export function createFormContextFactory<T>(contextName: string) {
  function provide(form: Form, value: T): void {
    if (!contextMapStore.has(form)) {
      contextMapStore.set(form, {})
    }
    const contextMap = contextMapStore.get(form)

    if (!contextMap[contextName]) {
      contextMap[contextName] = observable.ref<T>(value)
    }
    const contextRef = contextMap[contextName]

    contextRef.value = value
  }

  function consume(queryable: Queryable): T {
    const form = isForm(queryable) ? queryable : queryable.form

    const contextRef = contextMapStore.get(form)?.[contextName]

    return contextRef?.value
  }
  return { provide, consume }
}
