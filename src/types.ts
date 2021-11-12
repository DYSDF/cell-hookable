export type HookFnT = (...args: any) => Promise<void> | void

export type HooksT = Map<HookNameT, HookFnT[]>

export type HookNameT = any | { [name: string]: HookFnT }

export interface HookableT {
  _hooks: HooksT,
  _logger: LoggerT | false
}

export interface LoggerT {
  error(...args: any): void,
  fatal?(...args: any): void,
  warn?(...args: any): void
}
