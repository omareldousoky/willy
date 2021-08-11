export interface Action {
  actionTitle: string
  actionPermission: boolean
  actionOnClick(currentId?: string): void
}

export interface ActionWithIcon extends Action {
  actionIcon: string
}
