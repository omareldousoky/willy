export interface UserDateValues {
  _id: string;
  created: {at: number; by: string};
  updated: {at: number; by: string};
  roles: string[];
  branches?: string[];
  nationalId: string;
  nationalIdIssueDate: number;
  birthDate: number;
  gender: string;
  hrCode: string;
  status: string;
  mobilePhoneNumber: string;
  hiringDate: number;
  username: string;
  name: string;


}