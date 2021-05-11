export interface ActionsIconGroupProps {
  currentCustomerId: string;
  actions: Actions[];
}
export interface Actions {
  actionTitle: string;
  actionPermission: boolean;
  actionIcon: string;
  actionOnClick(
    currentCustomerId: string,
  ): void;
}