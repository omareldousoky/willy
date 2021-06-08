export interface Action {
  icon?: string
  title: string
  permission: boolean
  onActionClick(): void
}
export interface ProfileActionsProps {
  actions: Action[]
}
