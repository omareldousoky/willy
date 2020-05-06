export interface UserDateValues {
  created: {at: number; by: string};
  roles: string[];
  branches?: string[];
  nationalId: string;
  nationalIdIssueDate: number|string;
  birthDate: number|string;
  gender: string;
  hrCode: string;
  mobilePhoneNumber: string;
  hiringDate: number|string;
  username: string;
  name: string;


}