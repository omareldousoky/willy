import * as Yup from 'yup';

export const step1: any = {
    customerName: '',
    nationalId: '',
    nationalIdChecker: false,
    birthDate: '',
    gender: '',
    nationalIdIssueDate: '',
    customerAddressLatLong: {},
    customerHomeAddress: '',
    homePostalCode: '',
    homePhoneNumber: '',
    mobilePhoneNumber: '',
    faxNumber: '',
    emailAddress: '',
    customerWebsite: '',
};

export const step2 = {
    businessName: '',
    businessAddressLatLong: {},
    businessAddress: '',
    governorate: '',
    district: '',
    village: '',
    ruralUrban: '',
    businessPostalCode: '',
    businessPhoneNumber: '',
    businessSector: '',
    businessActivity: '',
    businessSpeciality: '',
    businessLicenseNumber: '',
    businessLicenseIssuePlace: '',
    businessLicenseIssueDate: '',
    commercialRegisterNumber: '',
    industryRegisterNumber: '',
    taxCardNumber: '',
};

export const step3 = {
    geographicalDistribution: '',
    representative: '',
    applicationDate: '',
    permanentEmployeeCount: '',
    partTimeEmployeeCount: '',
    accountNumber: '',
    accountBranch: '',
    comments: '',
};

export const customerCreationValidationStepOne = Yup.object().shape({
    customerName: Yup.string().trim().max(100, "Can't be more than 100 characters").required('required!'),
    nationalId: Yup.number().when('nationalIdChecker', {
        is: true,
        then: Yup.number().test('error', 'wowowow', ()=>  false),
        otherwise: Yup.number().required().min(10000000000000).max(99999999999999)
    }),
    nationalIdIssueDate: Yup.string().test(
        "Max Date", "Select a past date",
        (value: any) => { return value ? new Date(value).valueOf() <= new Date().setHours(0, 0, 0, 0) : true }
    ).required('required!'),
    customerHomeAddress: Yup.string().trim().max(500, "Can't be more than 500 characters").required('required!'),
    homePostalCode: Yup.string().max(5, "cant be more than 5"),
    homePhoneNumber: Yup.string().max(10, "cant be more than 10"),
    mobilePhoneNumber: Yup.string().max(11, "cant be more than 11"),
    faxNumber: Yup.number().min(1000000000).max(9999999999),
    emailAddress: Yup.string().email(),
    customerWebsite: Yup.string().url(),
})

export const customerCreationValidationStepTwo = Yup.object().shape({
    businessName: Yup.string().trim().max(100, "Can't be more than 100 characters").required('required!'),
    businessAddress: Yup.string().trim().max(500, "Can't be more than 500 characters").required('required!'),
    governorate: Yup.string().trim(),
    district: Yup.string().trim(),
    village: Yup.string().trim(),
    ruralUrban: Yup.string().trim(),
    businessPostalCode: Yup.string().max(5, "cant be more than 5"),
    businessPhoneNumber: Yup.string().max(10, "cant be more than 10"),
    businessSector: Yup.string().trim(),
    businessActivity: Yup.string().trim(),
    businessSpeciality: Yup.string().trim(),
    businessLicenseNumber: Yup.string().trim(),
    businessLicenseIssuePlace: Yup.string().trim().max(100, "Can't be more than 100 characters"),
    businessLicenseIssueDate: Yup.string().test(
        "Min Date", "Select a future date",
        (value: any) => { return value ? new Date(value).valueOf() <= new Date().setHours(0, 0, 0, 0) : true }),
    commercialRegisterNumber: Yup.string().trim().max(100, "Can't be more than 100 characters"),
    industryRegisterNumber: Yup.string().trim().max(100, "Can't be more than 100 characters"),
    taxCardNumber: Yup.string().trim().max(100, "Can't be more than 100 characters"),
})

export const customerCreationValidationStepThree = Yup.object().shape({
    geographicalDistribution: Yup.string().trim().required('required!'),
    representative: Yup.string().trim().required('required!'),
    applicationDate: Yup.string().test(
        "Min Date", "Select a future date",
        (value: any) => { return value ? new Date(value).valueOf() <= new Date().setHours(0, 0, 0, 0) : true }),
    permanentEmployeeCount: Yup.string().trim(),
    partTimeEmployeeCount: Yup.string().trim(),

    accountNumber: Yup.string().trim().max(100, "cant be more than 100"),
    accountBranch: Yup.string().trim().max(100, "cant be more than 100"),
    comments: Yup.string().trim().max(500, "cant be more than 100"),
})