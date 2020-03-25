import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

export const step1: any = {
    customerName: '',
    nationalId: '',
    nationalIdChecker: false,
    birthDate: '',
    gender: '',
    nationalIdIssueDate: '',
    customerAddressLatLong: '',
    customerAddressLatLongNumber: {
        lat: 0,
        lng: 0
    },
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
    businessAddressLatLong: '',
    businessAddressLatLongNumber: {
        lat: 0,
        lng: 0
    },
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
    applicationDate: new Date().toISOString().slice(0, 10),
    permanentEmployeeCount: '',
    partTimeEmployeeCount: '',
    accountNumber: '',
    accountBranch: '',
    comments: '',
};

let endOfDay: Date = new Date();
endOfDay.setHours(23, 59, 59, 59);

export const customerCreationValidationStepOne = Yup.object().shape({
    customerName: Yup.string().trim().max(100, local.maxLength100).required(local.required),
    nationalId: Yup.number()
    .when('nationalIdChecker', {
        is: true,
        then: Yup.number().test('error', local.duplicateNationalIdMessage, () => false),
        otherwise: Yup.number().required().min(10000000000000, local.nationalIdLengthShouldBe14).max(99999999999999, local.nationalIdLengthShouldBe14).required(local.required)
    })
    .when('birthDate',{
        is: '1800-01-01',
        then: Yup.number().test('error', local.wrongNationalId, () => false),
        otherwise: Yup.number().required().min(10000000000000, local.nationalIdLengthShouldBe14).max(99999999999999, local.nationalIdLengthShouldBe14).required(local.required)
    }),
    nationalIdIssueDate: Yup.string().test(
        "Max Date", local.dateShouldBeBeforeToday,
        (value: any) => { return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true }
    ).required(local.required),
    customerHomeAddress: Yup.string().trim().max(500, "Can't be more than 500 characters").required(local.required),
    homePostalCode: Yup.string().max(5, local.maxLength5),
    homePhoneNumber: Yup.string().max(10, local.maxLength10),
    mobilePhoneNumber: Yup.string().max(11, local.maxLength11),
    faxNumber: Yup.number().min(1000000000).max(9999999999),
    emailAddress: Yup.string().email(),
    customerWebsite: Yup.string().url(),
})

export const customerCreationValidationStepTwo = Yup.object().shape({
    businessName: Yup.string().trim().max(100, local.maxLength100).required(local.required),
    businessAddress: Yup.string().trim().max(500, "Can't be more than 500 characters").required(local.required),
    governorate: Yup.string().trim(),
    district: Yup.string().trim(),
    village: Yup.string().trim(),
    ruralUrban: Yup.string().trim(),
    businessPostalCode: Yup.string().max(5, local.maxLength5),
    businessPhoneNumber: Yup.string().max(10, local.maxLength10),
    businessSector: Yup.string().trim().required(local.required),
    businessActivity: Yup.string().trim().required(local.required),
    businessSpeciality: Yup.string().trim(),
    businessLicenseNumber: Yup.string().trim(),
    businessLicenseIssuePlace: Yup.string().trim().max(100, local.maxLength100),
    businessLicenseIssueDate: Yup.string().test(
        "Min Date", local.dateShouldBeBeforeToday,
        (value: any) => { return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true }),
    commercialRegisterNumber: Yup.string().trim().max(100, local.maxLength100),
    industryRegisterNumber: Yup.string().trim().max(100, local.maxLength100),
    taxCardNumber: Yup.string().trim().max(100, local.maxLength100),
})

export const customerCreationValidationStepThree = Yup.object().shape({
    geographicalDistribution: Yup.string().trim().required(local.required),
    representative: Yup.string().trim().required(local.required),
    applicationDate: Yup.string().test(
        "Min Date", local.dateShouldBeBeforeToday,
        (value: any) => { return value ? new Date(value).valueOf() <= endOfDay.valueOf() : true }).required(local.required),
    permanentEmployeeCount: Yup.string().trim(),
    partTimeEmployeeCount: Yup.string().trim(),

    accountNumber: Yup.string().trim().max(100, local.maxLength100),
    accountBranch: Yup.string().trim().max(100, local.maxLength100),
    comments: Yup.string().trim().max(500, local.maxLength100),
})