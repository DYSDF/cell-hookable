import { isPlainObj } from './utils'

type Handler = (...args: any) => Promise<void> | void

type Options = {
  immediate?: boolean
}

type Hooks = Record<string | number | symbol, Handler>

interface Logger {
  error(...args: any): void,
  fatal?(...args: any): void,
  warn?(...args: any): void
}

export default class Hookable {
  private _hooks: Map<any, Handler[]>
  private _lasts: Map<any, any[]>
  private _logger: Logger | false

  constructor(logger: Logger | false = console) {
    this._logger = logger
    this._hooks = new Map()
    this._lasts = new Map()
  }

  // 发布通知
  call(name: any, ...args: any) {
    this._lasts.set(name, args)
    return (async () => {
      try {
        await this._hooks.get(name)?.reduce(async (promise: Promise<any>, fn) => {
          await promise
          return fn(...args)
        }, Promise.resolve(null))

      } catch (err) {
        if (name !== 'error') await this.call('error', err)
        const logger = this._logger && (this._logger.fatal || this._logger.error)
        logger && logger(err)
      }
    })()
  }

  hook(name: any, handler: Handler, options?: Options): Function;
  hook(hooks: Hooks, options?: Options): Function;
  hook(name_or_hooks: any, handler?: Handler | Options, options?: Options): Function {
    if (isPlainObj(name_or_hooks)) {
      const unhooks = Object.keys(name_or_hooks).map(key => this.hook(key, name_or_hooks[key], handler as Options))
      return () => unhooks.forEach(unhook => unhook())
    }

    if (typeof handler !== 'function') {
      throw new Error('The parameter handler type is wrong, it should be function')
    }

    if (!this._hooks.has(name_or_hooks)) this._hooks.set(name_or_hooks, [])

    const callbacks = this._hooks.get(name_or_hooks)
    callbacks!.push(handler)

    if (options?.immediate && this._lasts.has(name_or_hooks)) {
      handler(...this._lasts.get(name_or_hooks) || [])
    }

    return () => this.unhook(name_or_hooks, handler)
  }

  hookOnce(name: any, handler: Handler, options?: Options): Function;
  hookOnce(hooks: Hooks, options?: Options): Function;
  hookOnce(name_or_hooks: any, handler?: Handler | Options, options?: Options): Function {
    if (isPlainObj(name_or_hooks)) {
      const unhooks = Object.keys(name_or_hooks).map(key => this.hookOnce(key, name_or_hooks[key], options as Options))
      return () => unhooks.forEach(unhook => unhook())
    }

    if (typeof handler !== 'function') {
      throw new Error('The parameter handler type is wrong, it should be function')
    }

    let unhook: any
    const wrap = (...args: any) => {
      unhook()
      unhook = null
      return handler(...args)
    }
    unhook = this.hook(name_or_hooks, wrap)
    return unhook
  }

  unhook(name: any, handler?: Handler): void;
  unhook(hooks: Hooks): void;
  unhook(name_or_hooks: any | Hooks, handler?: Handler): void {
    if (isPlainObj(name_or_hooks)) {
      return Object.keys(name_or_hooks).forEach(key => this.unhook(key, name_or_hooks[key]))
    }

    const is_generic = name_or_hooks instanceof RegExp
      || (typeof name_or_hooks === 'string' && name_or_hooks.includes('*'))
    // generic match
    if (is_generic) {
      if (name_or_hooks === '*') return this._hooks.clear()

      if (typeof name_or_hooks === 'string') {
        const [prefix, suffix] = name_or_hooks.split('*')
        const unhooks = Array.from(this._hooks.keys()).filter(h_n => {
          if (typeof h_n !== 'string') return false
          return h_n.startsWith(prefix) && h_n.endsWith(suffix)
        })
        unhooks.forEach(name => this.unhook(name, handler))
      }

      if (name_or_hooks instanceof RegExp) {
        const unhooks = Array.from(this._hooks.keys()).filter(h_n => {
          return name_or_hooks.test(h_n)
        })
        unhooks.forEach(name => this.unhook(name, handler))
      }
    } else {
      if (!this._hooks.has(name_or_hooks)) return
      if (typeof handler === 'function') {
        const callbacks = this._hooks.get(name_or_hooks)
        const idx = callbacks!.indexOf(handler)

        if (idx !== -1) {
          callbacks!.splice(idx, 1)
        }

        if (!callbacks!.length) {
          this._hooks.delete(name_or_hooks)
        }
      } else {
        this._hooks.delete(name_or_hooks)
      }
    }
  }
}
