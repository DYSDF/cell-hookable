import Hookable from '../src/index'

const hookable = new Hookable(false)

test('add single hook', async () => {
  const result = await new Promise(resolve => {
    hookable.hook('single', resolve)
    setTimeout(() => hookable.call('single', 'single hook'), 1000)
  })
  expect(result).toBe('single hook')
})

test('add multi hook', async () => {
  const result = await new Promise(resolve => {
    hookable.hook({
      'multi': resolve
    })
    setTimeout(() => hookable.call('multi', 'multi hook'), 1000)
  })
  expect(result).toBe('multi hook')
})

test('call hook api incorrectly', async () => {
  const symbol1 = Symbol()
  const symbol2 = Symbol()
  const result = await new Promise(resolve => {
    hookable.hook(symbol1, resolve)
    hookable.call(symbol2, 'success')
    setTimeout(() => resolve('failure'), 1000)
  })
  expect(result).toBe('failure')
})
