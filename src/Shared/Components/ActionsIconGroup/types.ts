export interface ActionsIconGroupProps {
  currentId: string
  actions: Actions[]
}
export interface Actions {
  actionTitle: string
  actionPermission: boolean
  actionIcon: string
  actionOnClick(currentId: string): void
}
