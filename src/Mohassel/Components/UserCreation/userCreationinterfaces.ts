export interface Touched {
  name?: boolean
  username?: boolean
  nationalId?: boolean
  gender?: boolean
  birthDate?: boolean
  nationalIdIssueDate?: boolean
  hrCode?: boolean
  mobilePhoneNumber?: boolean
  hiringDate?: boolean
  password?: boolean
  confirmPassword?: boolean
}
export interface Values {
  name: string
  username: string
  nationalId: string
  gender: string
  birthDate: number | string
  nationalIdIssueDate: number | string
  hrCode: string
  mobilePhoneNumber: string
  hiringDate: number | string
  password: string
  confirmPassword: string
}
export interface Errors {
  name?: string
  username?: string
  nationalId?: string
  gender?: string
  birthDate?: string
  nationalIdIssueDate?: string
  hrCode?: string
  mobilePhoneNumber?: string
  hiringDate?: string
  password?: string
  confirmPassword?: string
}

export interface RolesBranchesValues {
  roles: Array<{
    label: string
    value: string
    hasBranch?: boolean
    managerRole: string
  }>
  branches: Array<{ _id: string; branchName: string }>
}
export interface MainChoosesValues {
  mainRoleId: string
  mainBranchId: string
  manager: string
}
export interface UserInfo {
  name: string
  username: string
  nationalId: string
  gender: string
  birthDate: number | string
  nationalIdIssueDate: number | string
  hrCode: string
  mobilePhoneNumber: string
  hiringDate: number | string
  password: string
  faxNumber: string
  emailAddress: string
}
export interface User {
  userInfo: UserInfo
  branches?: string[]
  roles: string[]
  mainRoleId: string
  mainBranchId: string
  manager: string
}
