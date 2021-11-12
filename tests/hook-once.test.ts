import Hookable from '../src/index'

const hookable = new Hookable(false)

test('test hookOnce api', async () => {
  let first = true
  const result = await new Promise(resolve => {
    hookable.hookOnce('test', (value) => {
      if (first) {
        first = false
        return
      }
      resolve('test')
    })
    setTimeout(() => {
      resolve('cancel')
    }, 1000)
    hookable.call('test')
    hookable.call('test')
  })
  expect(result).toBe('cancel')
})

test('test hookOnce api', async () => {
  let first = true
  const result = await new Promise(resolve => {
    hookable.hookOnce({
      test: () => {
        if (first) {
          first = false
          return
        }
        resolve('test')
      }
    })
    setTimeout(() => {
      resolve('cancel')
    }, 1000)
    hookable.call('test')
    hookable.call('test')
  })
  expect(result).toBe('cancel')
})
