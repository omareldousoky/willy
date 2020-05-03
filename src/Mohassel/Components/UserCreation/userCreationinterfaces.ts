export interface Touched {
    name?: boolean;
    username?: boolean;
    nationalId?: boolean;
    hrCode?: boolean;
    mobilePhoneNumber?: boolean;
    hiringDate?: boolean;
    password?: boolean;
    confirmPassword?: boolean;

}
export interface Values {
    name: string;
    username: string;
    nationalId: string;
    hrCode: string;
    mobilePhoneNumber: string;
    hiringDate: number|string;
    password: string;
    confirmPassword: string;
}
export interface Errors {
    name?: string;
    username?: string;
    nationalId?: string;
    hrCode?: string;
    mobilePhoneNumber?: string;
    hiringDate?: string;
    password?: string;
    confirmPassword?: string;
}

export interface RolesBranchesValues {
    roles:  {label: string; value: string;hasBranch: string}[];
    branches?: {label: string; value: string}[];
}

export interface User {
    userInfo: Values;
    branches?: string[];
    roles: string[];
}