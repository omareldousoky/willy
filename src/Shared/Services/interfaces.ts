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
		_id?: string;
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
    currentHomeAddress?: string;
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
	blocked?: {
		isBlocked?: boolean;
		reason?: string;
    };
    customerType?: string;
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
    customerType: string;
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

interface Signature {
	by: string;
	at: number;
}

export interface Trace {
	created: Signature;
	updated: Signature;
}

export interface QuarterReport{
    fundingWalletTrends: {
        individualAverageLoan: number;
        individualAverageWallet: number;
        groupAverageLoan: number;
        groupAverageWallet: number;
        averageDaysToFinishIndividualLoans: number;
        averageDaysToFinishGroupLoans: number;
        collectionExpectations1To30: number;
        collectionExpectations31To90: number;
        collectionExpectations91To180: number;
        collectionExpectations181To270: number;
        collectionExpectations271To365: number;
        collectionExpectationsAfterYear: number;
        walletGrowthRate: number;
      };
      fundingWalletQuality: {
        writtenOffLoansRate: number;
        riskCoverageRate: number;
        committedCustomersWalletRate: number;
        lateCustomersWalletTo30DaysRate: number;
        lateCustomersWalletTo60DaysRate: number;
        lateCustomersWalletTo90DaysRate: number;
        lateCustomersWalletTo120DaysRate: number;
        lateCustomersWalletAfter120DaysRate: number;
        carryOverInstallmentsCustomersWalletRate: number;
        rescheduledCustomerWalletRate: number;
      };
      fromDate: string;
      toDate: string;
      createdAt: string;
    }

    export interface MonthReport{
        totalIndividualCount: {
            onGoingCutomer: number;
            newCustomer: number;
            total: number;
        };
        maleIndividualCount: {
            onGoingCutomer: number;
            newCustomer: number;
            total: number;
        };
        femaleIndividualCount: {
            onGoingCutomer: number;
            newCustomer: number;
            total: number;
        };
        totalIndividualCredit: {
            onGoingCutomer: number;
            newCustomer: number;
            total: number;
        };
        maleIndividualCredit: {
            onGoingCutomer: number;
            newCustomer: number;
            total: number;
        };
        femaleIndividualCredit: {
            onGoingCutomer: number;
            newCustomer: number;
            total: number;
        };
        totalGroupCount: {
            onGoingCutomer: number;
            newCustomer: number;
            total: number;
        };
        maleGroupCount: {
            onGoingCutomer: number;
            newCustomer: number;
            total: number;
        };
        femaleGroupCount: {
            onGoingCutomer: number;
            newCustomer: number;
            total: number;
        };
        totalGroupCredit: {
            onGoingCutomer: number;
            newCustomer: number;
            total: number;
        };
        maleGroupCredit: {
            onGoingCutomer: number;
            newCustomer: number;
            total: number;
        };
        femaleGroupCredit: {
            onGoingCutomer: number;
            newCustomer: number;
            total: number;
        };
        totalCredit: number;
        totalCount: number;
        commercialCount: number;
        commercialCredit: number;
        productionCount: number;
        productionCredit: number;
        serviceCount: number;
        serviceCredit: number;
        agriculturalCount: number;
        agriculturalCredit: number;
        individualWrittenOffLoansCount: {
            month: number;
            year: number;
        };
        individualWrittenOffLoansCredit: {
            month: number;
            year: number;
        };
        groupWrittenOffLoansCount: {
            month: number;
            year: number;
        };
        groupWrittenOffLoansCredit: {
            month: number;
            year: number;
        };
        writtenOffLoansCount: {
            month: number;
            year: number;
        };
        writtenOffLoansCredit: {
            month: number;
            year: number;
        };
        collectedWrittenOffLoansCount: {
            month: number;
            year: number;
        };
        collectedWrittenOffLoansCredit: {
            month: number;
            year: number;
        };
        arrears: [
            {
                tier: string;
                customers: number;
                arrears: number;
                wallet: number;
                provision: number;
            }
        ];
        totalCustomers: number;
        totalArrears: number;
        totalWallet: number;
        totalProvision: number;
        fromDate: string;
        toDate: string;
        createdAt: string;
        fundingWalletAnalysisCountValidation: string;
        fundingWalletAnalysisCreditValidation: string;
        arrearsCountValidation: string;
        arrearsCreditValidation: string;
        fundingWalletAnalysisSheetCount: number;
        fundingWalletAnalysisSheetCredit: number;
        arrearsSheetCount: number;
        arrearsSheetCredit: number;
        totalGroupLoansCount: {
            onGoingCutomer: number;
            newCustomer: number;
            total: number;
        };
    }
export interface OfficersGroup {
    id?: string;
    leader: {id: string; name: string};
    officers: {id: string; name: string}[];
    status?: string;
}
export interface GroupsByBranch{
    id: string;
    status: string;
    branchId: string;
    startDate: string;
    leader: {
        id: string;
        name: string;
    };
    officers: 
        {
            id: string;
            name: string;
        }[];
}