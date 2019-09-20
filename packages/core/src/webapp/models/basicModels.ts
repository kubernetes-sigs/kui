export interface Delete {
  verb: 'delete'
  name: string
  type?: string
}

export interface Watchable {
  refreshCommand: string
  watchByDefault: boolean // false: the model can be turned into a watching mode, but not the default mode
  watchInterval?: number
  watchLimit?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isWatchable(model: any): model is Watchable {
  return model && model.refreshCommand
}
