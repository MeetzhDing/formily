import { GeneralField } from '@formily/core';
import { autorun, untracked } from '@formily/reactive';

/**
 * 在 x-reactions 中使用，允许在组件初始化时仅注册一次 <br/>
 *
 * 可以用来注册自定义初始化逻辑，如外部数据绑定，Formily声明周期回调注册等 <br/>
 * [github讨论 x-inject-run](https://github.com/alibaba/formily/discussions/3898)
 */
export function runReactionOnce(fn: (field: GeneralField) => void) {
  function reaction(field: GeneralField) {
    autorun.memo(() => {
      untracked(() => {
        fn(field);
      });
    }, []);
  }
  return reaction;
}
