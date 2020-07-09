export interface Branch {
    longitude?: number;
    latitude?: number;
    name: string;
    governorate: string;
    status?: string;
    phoneNumber?: string;
    faxNumber?: string;
    address?: string;
    postalCode?: string;
    licenseDate: number | string;
    bankAccount: string;
    costCenter: string;
    licenseNumber: string;
}

export interface Customer {
    accountBranch?: string;
    accountNumber?: string;
    applicationDate?: number;
    birthDate?: number;
    branchId?: string;
    branchName?: string;
    businessActivity?: string;
    businessAddress?: string;
    businessAddressLatLong?: string;
    businessLicenseIssueDate?: number;
    businessLicenseIssuePlace?: string;
    businessLicenseNumber?: string;
    businessName?: string;
    businessPhoneNumber?: string;
    businessPostalCode?: string;
    businessSector?: string;
    businessSpeciality?: string;
    code?: number;
    comments?: string;
    commercialRegisterNumber?: string;
    created?: {
        by?: string;
        at?: number;
        userName?: string;
    };
    customerAddressLatLong?: string;
    customerHomeAddress?: string;
    customerName?: string;
    customerWebsite?: string;
    district?: string;
    emailAddress?: string;
    faxNumber?: string;
    gender?: string;
    geographicalDistribution?: string;
    governorate?: string;
    hasLoan?: boolean;
    homePhoneNumber?: string;
    homePostalCode?: string;
    industryRegisterNumber?: string;
    key?: number;
    mobilePhoneNumber?: string;
    nationalId?: string;
    nationalIdIssueDate?: number;
    partTimeEmployeeCount?: number;
    permanentEmployeeCount?: number;
    representative?: string;
    ruralUrban?: string;
    taxCardNumber?: string;
    village?: string;
    allowMultiLoans?: boolean;
    allowGuarantorLoan?: boolean;
    allowMultiGuarantee?: boolean;
    _id?: string;
}

export interface Action {
    loanBranchId: string;
    action: string;
    actualDate: number;
    groupID: string;
    installmentSerial: number;
    loanId: string;
    officer: string;
    transactionAmount: number;
    truthDate: number;
    _id: string;
}
export interface PendingActions {
    receiptNumber?: string;
    transactions?: Array<Action>;
    beneficiaryId?: string;
    _id?: string;
}

export interface DocumentType {
    id?: string;
    pages: number;
    type: string;
    paperType: string;
    name: string;
    active: boolean;
    updatable: boolean;
}