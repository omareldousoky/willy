 export interface Section {
  _id: string;
  key: string;
  i18n: any;
  actions: Array<any>;
}
export interface Role {
  permissions: Array<any>;
  hasBranch: boolean;
  roleName: string;
  _id: string;
}
interface Branch {
  _id: string;
  name: string;
}
export interface UserDateValues {
  _id: string;
  created: {at: number; by: string};
  updated: {at: number; by: string};
  roles: Role[];
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
  branchesObjects: Array<Branch>;
}