export interface ActionsDropdownProps {
  currentCustomerId: string;
  openCustomerId: string;
  title: string;
  actions: Actions[];
  blocked?: boolean;
  onDropDownClick(): void;
}
export interface Actions {
  actionTitle(blocked?: any): string;
  actionPermission: boolean;
  actionOnClick(event: React.MouseEvent<HTMLButtonElement>, currentCustomerId: string, blocked?: any): void;
}