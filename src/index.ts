import { HookFnT, HooksT, HookNameT, LoggerT } from './types'

export default class Hookable {
  private _hooks: HooksT
  private _logger: LoggerT | false

  constructor(logger: LoggerT | false = console) {
    this._logger = logger
    this._hooks = new Map()
  }

  // 发布通知
  async call(name: any, ...args: any) {
    if (!this._hooks.has(name)) return

    try {
      await this._hooks.get(name)!.reduce(async (promise: Promise<any>, fn) => {
        await promise
        return fn(...args)
      }, Promise.resolve(null))
    } catch (err) {
      if (name !== 'error') await this.call('error', err)
      const logger = this._logger && (this._logger.fatal || this._logger.error)
      logger && logger(err)
    }
  }

  // 注册响应回调
  hook(name: HookNameT, handler: HookFnT | void): Function {
    if (typeof name === 'object') {
      const unhooks = Object.keys(name).map(key => this.hook(key, name[key]))
      return () => unhooks.forEach(unhook => unhook())
    }

    if (typeof handler !== 'function') {
      throw new Error('The parameter handler type is wrong, it should be function')
    }

    if (!this._hooks.has(name)) this._hooks.set(name, [])

    const callbacks = this._hooks.get(name)
    callbacks!.push(handler)
    return () => this.unhook(name, handler)
  }

  hookOnce(name: HookNameT, handler: HookFnT | void): Function {
    if (typeof name === 'object') {
      const unhooks = Object.keys(name).map(key => this.hookOnce(key, name[key]))
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
    unhook = this.hook(name, wrap)
    return unhook
  }

  // 注销响应回调
  unhook(name: HookNameT, handler: HookFnT | void): any {
    if (typeof name === 'object') {
      return Object.keys(name).forEach(key => this.unhook(key, name[key]))
    }

    if (this._hooks.has(name)) {
      if (typeof handler === 'function') {
        const callbacks = this._hooks.get(name)
        const idx = callbacks!.indexOf(handler)

        if (idx !== -1) {
          callbacks!.splice(idx, 1)
        }

        if (!callbacks!.length) {
          this._hooks.delete(name)
        }
      } else {
        this._hooks.delete(name)
      }
    } else if (name === '*') {
      this._hooks.clear()
    }
  }
}
