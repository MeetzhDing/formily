import { RuntimeSchema, VoidSchema } from './runtimeSchema';

export function isVoidSchema(schema: RuntimeSchema): schema is VoidSchema {
  return schema.type === 'void';
}
