export interface BasicValues {
    branchAddressLatLong: {lat: number ; lng: number};
    name: string;
    governorate: string;
    status: string;
    phoneNumber?: string;
    faxNumber?: string;
    address?: string;
    postalCode?: string;
    licenseDate: number|string;
    licenseNumber: string;
}
export interface BasicErrors { 
    name?: string;
    governorate?: string;
    status?: string;
    phoneNumber?: string;
    faxNumber?: string;
    address?: string;
    postalCode?: string;
    licenseDate?: string;
    licenseNumber?: string;
}

export interface BasicTouched {
    name?: boolean;
    governorate?: boolean;
    status?: boolean;
    phoneNumber?: boolean;
    faxNumber?: boolean;
    address?: boolean;
    postalCode?: boolean;
    licenseDate?: boolean;
    licenseNumber?: boolean;
}
