
import { HookFunction, Context, Suite } from 'mocha'
import { Application } from 'spectron'

interface ISuite extends Suite {
  app: Application
}

interface IBeforeOptions {
  noApp?: boolean
}

declare function before (ctx: Suite, options?: IBeforeOptions): HookFunction
declare function after (ctx: Suite, f?: () => void): HookFunction
declare function oops (ctx: Suite): ((err: Error) => void)

declare function rp (opts: Object): any

