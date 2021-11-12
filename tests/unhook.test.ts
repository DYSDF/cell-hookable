import Hookable from '../src/index'

const hookable = new Hookable()

test('test unhook api', async () => {
  const result = await new Promise(resolve => {
    const callback = (value: string) => resolve(value)
    hookable.hook('test', callback)
    hookable.unhook('test', callback)
    hookable.call('test', 'success')
    setTimeout(() => resolve('cancel'), 1000)
  })
  expect(result).toBe('cancel')
})

test('test unhook api', async () => {
  const result = await new Promise(resolve => {
    const callback = (value: string) => resolve(value)
    hookable.hook('test', callback)
    hookable.unhook('test')
    hookable.call('test', 'success')
    setTimeout(() => resolve('cancel'), 1000)
  })
  expect(result).toBe('cancel')
})

test('test unhook api', async () => {
  const result = await new Promise(resolve => {
    const callback = (value: string) => resolve(value)
    const unhook = hookable.hook({
      hook_a: callback,
      hook_b: callback,
    })
    unhook()
    hookable.call('hook_a', 'success')
    hookable.call('hook_b', 'success')
    setTimeout(() => resolve('cancel'), 1000)
  })
  expect(result).toBe('cancel')
})

test('test unhook api', async () => {
  const result = await new Promise(resolve => {
    const callback = (value: string) => resolve(value)
    hookable.hook({
      hook_a: callback,
      hook_b: callback,
    })
    hookable.unhook({
      hook_a: callback,
      hook_b: callback,
    })
    hookable.call('hook_a', 'success')
    hookable.call('hook_b', 'success')
    setTimeout(() => resolve('cancel'), 1000)
  })
  expect(result).toBe('cancel')
})
