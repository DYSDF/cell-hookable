import Hookable from '../src/index'

test('hook immediate with last args', async () => {
  const hookable = new Hookable(false)
  const result = await new Promise(resolve => {
    hookable.hook('event', resolve)
    setTimeout(() => resolve('cancel'), 1000)
  })
  expect(result).toBe('cancel')
})

test('hook immediate with last args', async () => {
  const hookable = new Hookable(false)
  const result = await new Promise(resolve => {
    hookable.call('event', 'success')
    hookable.hook('event', d => resolve(d), {
      immediate: true
    })
    setTimeout(() => resolve('cancel'), 1000)
  })
  expect(result).toBe('success')
})
