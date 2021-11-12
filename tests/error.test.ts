import Hookable from '../src/index'

test('catch error by error hook', async () => {
  const hookable = new Hookable({
    error() { }
  })
  const result: Error = await new Promise(resolve => {
    hookable.hook('test', () => {
      throw new Error('custom error')
    })
    hookable.hook('error', err => resolve(err))
    hookable.call('test')
  })
  expect(result.message).toBe('custom error')
})

test('call hook error direct', async () => {
  const hookable = new Hookable(false)
  const result: Error = await new Promise(resolve => {
    hookable.hook('error', resolve)
    hookable.call('error', new Error('custom error'))
  })
  expect(result.message).toBe('custom error')
})
