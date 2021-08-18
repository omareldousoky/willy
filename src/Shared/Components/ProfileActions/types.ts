export interface Action {
  icon?: string
  title: string
  permission: boolean
  onActionClick(): void
  isLoading?: boolean
}
export interface ProfileActionsProps {
  actions: Action[]
}
