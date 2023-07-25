import { createSchemaField as rawCreateSchemaField, RecursionField } from '@formily/vue';
import type { ISchemaFieldProps, DefineComponent } from '@formily/vue';
import { computed, defineComponent } from 'vue-demi';

import { RuntimeSchema } from '../schema';
import { transformerSchema } from '../schema/transformerSchema';
import type { SimpleMerge } from '../global';

export { RecursionField };

type CreateSchemaFieldReturn = SimpleMerge<
  ReturnType<typeof rawCreateSchemaField>,
  {
    SchemaField: DefineComponent<
      SimpleMerge<
        ISchemaFieldProps,
        {
          schema: RuntimeSchema;
        }
      >
    >;
  }
>;

/** 内置 transformerSchema 处理的 SchemaField */
export function createSchemaField(options: Parameters<typeof rawCreateSchemaField>[0]): CreateSchemaFieldReturn {
  const { SchemaField: rawSchemaField, ...typeSchemaField } = rawCreateSchemaField(options);

  const SchemaField = defineComponent({
    name: 'SchemaField',
    inheritAttrs: false,
    props: rawSchemaField.props,
    setup(props: ISchemaFieldProps) {
      const tSchema = computed(() => {
        return transformerSchema(props.schema as any);
      });
      return {
        tSchema,
      };
    },
    render(h) {
      return h(
        rawSchemaField,
        {
          on: this.$listeners,
          attrs: this.$attrs,
          props: { ...this.$props, schema: this.tSchema },
          scopedSlots: this.$scopedSlots,
        },
        Object.values(this.$slots).map((vnode: any) => {
          vnode.context = this._self;
          return vnode;
        }),
      );
    },
  }) as unknown as CreateSchemaFieldReturn['SchemaField'];

  return {
    SchemaField,
    ...typeSchemaField,
  };
}
