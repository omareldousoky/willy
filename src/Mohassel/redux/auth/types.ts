export interface Branch {
    name: string;
    _id: string;
}

export interface Auth {
    validBranches?: Array<Branch>;
    roles?: Array<string>;
    loading: boolean;
    clientPermissions?: any;
}