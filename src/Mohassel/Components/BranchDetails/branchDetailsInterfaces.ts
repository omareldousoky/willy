export interface  BranchBasicsView {
    _id: string;
    created: {at: number; by: string};
    updated: {at: number; by: string};
    name: string;
    address: string;
    longitude: number;
    latitude: number;
    phoneNumber: string;
    faxNumber: string;
    branchCode: number;
    governorate: string;
    status: string;
    products: string[];
}
