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
    name: Yup.string().trim().max(100, local.maxLength100).required(local.required),
    governorate: Yup.string().trim().max(11,local.maxLength11).required(local.required),
    phoneNumber: Yup.string().min(11, local.minLength11),
    faxNumber: Yup.string().trim(),
    address: Yup.string().trim().max(100, local.maxLength100).required(local.required),
    postalCode: Yup.string().trim(),
    status: Yup.string().trim().oneOf(["active","inactive"])
})