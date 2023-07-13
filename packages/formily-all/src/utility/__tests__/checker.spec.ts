import { createForm } from '@formily/core'
import { checkerBuilder, formCheckerBuilder } from '../checker'

enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

enum UserResponse {
  No = 0,
  Yes = 1,
}

enum FileAccess {
  // constant members
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // computed member
  G = '123'.length,
}

describe('checkerBuilder', () => {
  interface GlobalState {
    direction: Direction
    userResponse: UserResponse
    details: {
      fileAccess: FileAccess
    }
    createTime: Date
  }

  const TestChecker = checkerBuilder({
    enumMap: {
      direction: {
        path: 'direction',
        enum: Direction,
        valueType: null as unknown as Direction,
      },
      userResponse: {
        path: 'userResponse',
        enum: UserResponse,
        valueType: null as unknown as UserResponse,
      },
      fileAccess: {
        path: 'details.fileAccess',
        enum: FileAccess,
        valueType: null as unknown as FileAccess,
      },
    },
    valueMap: {
      createTime: {
        path: 'createTime',
        valueType: null as unknown as Date,
      },
    },
  })

  it('typescript infer works', () => {
    const form = createForm()
    const check = TestChecker(form)

    const a = check.direction.is.Down
    const b = check.userResponse.not.Yes
    const c = check.fileAccess.field?.value
    const d = check.createTime.value

    expect(a && b && c && d).toBe(false)
  })

  it('getter works', () => {
    const globalState: GlobalState = {
      direction: Direction.Down,
      userResponse: UserResponse.Yes,
      details: {
        fileAccess: FileAccess.ReadWrite,
      },
      createTime: new Date(),
    }
    const check = TestChecker(globalState)

    expect(check.direction.is.Down).toBeTruthy()
    expect(check.userResponse.not.Yes).toBeFalsy()
    expect(check.fileAccess.field.value).toBe(FileAccess.ReadWrite)
    expect(check.createTime.field.value).toBe(check.createTime.value)
  })
})

describe('formCheckerBuilder', () => {
  const TestChecker = formCheckerBuilder({
    enumMap: {
      direction: {
        path: 'direction',
        enum: Direction,
        valueType: null as unknown as Direction,
      },
      userResponse: {
        path: 'userResponse',
        enum: UserResponse,
        valueType: null as unknown as UserResponse,
      },
      fileAccess: {
        path: 'details.fileAccess',
        enum: FileAccess,
        valueType: null as unknown as FileAccess,
      },
    },
    valueMap: {
      createTime: {
        path: 'createTime',
        valueType: null as unknown as Date,
      },
    },
  })

  it('typescript infer works', () => {
    const form = createForm()
    const check = TestChecker(form)

    const a = check.direction.is.Down
    const b = check.userResponse.not.Yes
    const c = check.fileAccess.field?.value
    const d = check.createTime.value
    const f = check.form

    expect(a && b && c && d && f).toBe(false)
  })

  it('getter works', () => {
    const form = createForm()
    form.createField({
      name: 'direction',
      value: Direction.Down,
    })
    form.createField({
      name: 'userResponse',
      value: UserResponse.Yes,
    })
    form.createField({
      name: 'details.fileAccess',
      value: FileAccess.ReadWrite,
    })
    form.createField({
      name: 'createTime',
      value: new Date(),
    })
    const check = TestChecker(form)

    expect(check.direction.is.Down).toBeTruthy()
    expect(check.userResponse.not.Yes).toBeFalsy()
    expect(check.fileAccess.field.value).toBe(FileAccess.ReadWrite)
    expect(check.createTime.field.value).toBe(check.createTime.value)
    expect(check.form).toBe(form)
  })
})
