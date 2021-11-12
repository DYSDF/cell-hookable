# Hookable

> 支持异步回调的hooks支持库

## 安装

使用npm:

```bash
npm install cell-hookable
```

## 使用方法

**基于Hookable进行类扩展:**

```js
import Hookable from 'cell-hookable'

export default class Foo extends Hookable {
  constructor() {
    super()
  }

  async testFn() {
    await this.call('hook_1')
  }
}
```

**反注册hooks:**

```js
const hookable = new Hookable()

const hook_0 = async () => { /* ... */ }
const hook_1 = async () => { /* ... */ }

hookable.hook('hook_0', hook_0)
const unregisterHook_1 = hookable.hook('hook_1', hook_1)

hookable.unhook('hook_0', hook_0)

// or

unregisterHook_1()
```

**注册一次性hook:**

```js
const hookable = new Hookable()

const unregister = hookable.hook('hook_0', async () => {
  unregister()
  /* ... */
})

// or

hookable.hookOnce('hook_0', async () => {
  /* ... */
})
```

## Hookable class

### `hook(name, fn)` / `hook({ name: fn })`

注册钩子函数， `fn`必须是函数。

返回`unregister`函数，如果调用此函数，则取消已注册的钩子。

### `hookOnce(name, fn)` / `hookOnce({ name: fn })`

类似于`hook`方法，但钩子函数只会调用一次。

返回`unregister`函数，作用同`hook`方法。

### `async call(name, ...args)`

用于**串行**触发注册的钩子函数。
