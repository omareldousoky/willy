export interface BasicValues {
    branchAddressLatLong?: {lat: number ; lng: number};
    name: string;
    governorate: string;
    status: string;
    phoneNumber?: string;
    faxNumber?: string;
    address?: string;
    postalCode?: string;
}
export interface Branch {
    longitude?: number;
    latitude?: number;
    name: string;
    governorate: string;
    status: string;
    phoneNumber?: string;
    faxNumber?: string;
    address?: string;
    postalCode?: string;

}
export interface BasicErrors {
    branchAddressLatLong?: string;
    name?: string;
    governorate?: string;
    status?: string;
    phoneNumber?: string;
    faxNumber?: string;
    address?: string;
    postalCode?: string;
}

export interface BasicTouched {
    name?: boolean;
    governorate?: boolean;
    status?: boolean;
    phoneNumber?: boolean;
    faxNumber?: boolean;
    address?: boolean;
    postalCode?: boolean;
    branchAddressLatLong?: boolean;
}
export const step1: BasicValues = {
    branchAddressLatLong: undefined, 
    name: '',
    governorate: '',
    status: '',
    phoneNumber: '',
    faxNumber: '',
    address: '',
    postalCode: '',
}