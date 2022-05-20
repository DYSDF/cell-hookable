import Hookable from '../src/index'

test('test unhook api', async () => {
  const hookable = new Hookable()
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
  const hookable = new Hookable()
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
  const hookable = new Hookable()
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
  const hookable = new Hookable()
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

test('test generic unhook api', async () => {
  const hookable = new Hookable()
  const result = await new Promise(resolve => {
    const callback = (value: string) => resolve(value)
    hookable.hook({
      A_hook_a: callback,
      B_hook_b: callback,
      C_hook_c: callback
    })
    hookable.unhook({
      '*_a': callback,
      'B_*': callback
    })
    hookable.unhook(/^C_.+/, callback)
    hookable.call('A_hook_a', 'success A')
    hookable.call('B_hook_b', 'success B')
    hookable.call('C_hook_c', 'success C')
    setTimeout(() => resolve('cancel'), 1000)
  })
  expect(result).toBe('cancel')
})
