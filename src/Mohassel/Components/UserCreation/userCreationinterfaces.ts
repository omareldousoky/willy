export interface Touched {
    userFullName?: boolean;
    userName?: boolean;
    userNationalId?: boolean;
    userHrCode?: boolean;
    userMobileNumber?: boolean;
    userHiringDate?: boolean;
    userPassword?: boolean;
    userConfirmPassword?: boolean;

}
export interface Values {
    userFullName: string;
    userName: string;
    userNationalId: string;
    userHrCode: string;
    userMobileNumber: string;
    userHiringDate: string;
    userPassword: string;
    userConfirmPassword: string;
}
export interface Errors {
    userFullName?: string;
    userName?: string;
    userNationalId?: string;
    userHrCode?: string;
    userMobileNumber?: string;
    userHiringDate?: string;
    userPassword?: string;
    userConfirmPassword?: string;
}

export interface RolesValues {
    userRoles:  {label: string; value: string;hasBranch: string}[];
    userBranches: {label: string; value: string}[];
}