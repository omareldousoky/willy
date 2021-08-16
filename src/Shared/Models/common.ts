export interface Action {
  actionTitle: string
  actionPermission: boolean
  actionOnClick(currentId?: string): void
}

export interface ActionWithIcon extends Action {
  actionIcon: string
}
export interface Signature {
  by?: string
  at?: number
  userName?: string
}

export interface Trace {
  created: Signature
  updated: Signature
}
