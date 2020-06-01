import { BasicValues } from "./branchCreationInterfaces";
import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';


export const step1: BasicValues = {
    branchAddressLatLong: {lat: 0, lng: 0}, 
    name: '',
    governorate: '',
    status: 'active',
    phoneNumber: '',
    faxNumber: '',
    address: '',
    postalCode: '',
}

export const branchCreationValidationStepOne = Yup.object().shape({
    name: Yup.string().trim().matches(/[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]/,local.branchNameInavlid).max(150, local.maxLength150).required(local.required),
    governorate: Yup.string().trim().matches(/[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]/,local.governorateNameInavlid).max(150,local.maxLength150).required(local.required),
    phoneNumber: Yup.string().matches(/^[0-9]*$/,local.onlyNumbers).max(11,local.maxLength11),
    faxNumber: Yup.string().min(10, local.minLength10).max(11,local.maxLength11),
    address: Yup.string().trim().max(150, local.maxLength150).required(local.required),
    postalCode: Yup.string().trim().matches(/^[0-9]*$/,local.onlyNumbers).max(5,local.maxLength5),
    status: Yup.string().trim().oneOf(["active","inactive"])
})