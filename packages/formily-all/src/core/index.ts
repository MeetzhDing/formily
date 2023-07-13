import { ArrayField, Field, Form, ObjectField, VoidField } from '@formily/core'

export type Queryable = VoidField | Field | ObjectField | ArrayField | Form
