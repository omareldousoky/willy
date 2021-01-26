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
    geoAreaId?: string;
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
    representativeName?: string;
    ruralUrban?: string;
    taxCardNumber?: string;
    village?: string;
    maxLoansAllowed?: number;
    allowGuarantorLoan?: boolean;
    guarantorMaxLoans?: number;
    maxPrincipal?: number;
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
    payerId?: string;
    payerNationalId?: string;
    payerType?: string;
    payerName?: string;
    _id?: string;
}

export interface DocumentType {
    id?: string;
    pages: number;
    type: string;
    paperType: string;
    name: string;
    active?: boolean;
    updatable?: boolean;
    isHidden?: boolean;
}
export interface GuaranteedLoan {
    guarantorOrder: string;
    customerKey: string;
    applicationCode: string;
    customerName: string;
    appStatus?: string;
    approvalDate?: string;
    loanStatus?: string;
    issueDate?: string;
}
export interface GuaranteedLoans {
    data: Array<GuaranteedLoan>;
    GuarantorName: string;
}

export interface Document {
    key: string;
    url: string | ArrayBuffer | null;
    valid: boolean;
    delete?: boolean;
    selected?: boolean;
}

export interface LoanOfficer {
    birthDate: number;
    branches: Array<string>;
    gender: string;
    hrCode: string;
    mainBranchId: string;
    mainRoleId: string;
    name: string;
    nationalId: string;
    roles: Array<string>;
    status: string;
    username: string;
    _id: string;
}
export interface Clearance {
    _id: string;
    bankName: string;
    beneficiaryType: string;
    branchId: string;
    branchName: string;
    clearanceReason: string;
    customerId: string;
    customerKey: string;
    customerName: string;
    customerNationalId: number;
    documentPhotoURL: string;
    issuedDate: number | string;
    lastPaidInstDate: number;
    loanId: string;
    loanKey: number;
    notes: string;
    principal: number;
    receiptDate: number;
    receiptPhotoURL: string;
    registrationDate: number;
    status: string;
    transactionKey?: number;
    manualReceipt?: string;
}
export interface OfficersGroup {
    id?: string;
    leader: {id: string; name: string};
    officers: {id: string; name: string}[];
    status?: string;
}