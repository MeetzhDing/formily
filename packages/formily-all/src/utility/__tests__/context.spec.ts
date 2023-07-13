import { createForm } from '@formily/core'
import { createFormContextFactory } from '../context'

type IAccount = { id: string }
const { provide: provideAccount, consume: consumeAccount } =
  createFormContextFactory<IAccount>('account')

type IWhitelist = Record<string, boolean>
const { provide: provideWhitelist, consume: consumeWhitelist } =
  createFormContextFactory<IWhitelist>('whitelist')

describe('createFormContext', () => {
  it('consume form context', () => {
    const mainForm = createForm()
    const sideForm = createForm()

    provideAccount(mainForm, { id: '999' })
    provideAccount(sideForm, { id: '100' })
    expect(consumeAccount(mainForm).id).toBe('999')
    expect(consumeAccount(sideForm).id).toBe('100')
  })

  it('consume form multi context', () => {
    const mainForm = createForm()
    const sideForm = createForm()

    provideAccount(mainForm, { id: '999' })
    provideWhitelist(sideForm, { upgrade: false })
    expect(consumeAccount(mainForm).id).toBe('999')
    expect(consumeWhitelist(sideForm)).toEqual({ upgrade: false })
  })

  it('consume without provide', () => {
    const mainForm = createForm()
    const sideForm = createForm()
    provideAccount(mainForm, { id: '999' })
    expect(consumeWhitelist(sideForm)).toBe(undefined)
    expect(consumeAccount(mainForm)).toEqual({ id: '999' })
  })
})
