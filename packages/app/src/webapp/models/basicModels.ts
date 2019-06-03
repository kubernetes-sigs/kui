export interface IDelete {
  verb: 'delete'
  name: string
  type?: string
}

export interface IWatchable {
  refreshCommand: string
  watchByDefault: boolean // false: the model can be turned into a watching mode, but not the default mode
  watchInterval?: number
  watchLimit?: number
}
