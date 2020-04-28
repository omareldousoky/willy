import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';
import { Values } from './userCreationinterfaces';

export const step1: Values = {
    userFullName: '',
    userName: '',
    userNationalId:'',
    userHrCode:'',
    userMobileNumber:'',
    userHiringDate: '',
    userPassword:'',
    userConfirmPassword:'',
}


export const userCreationValidationStepOne = Yup.object().shape({
    userFullName: Yup.string().trim().max(100, local.maxLength100).required(local.required),
    userName: Yup.string().trim().max(100, local.maxLength100).required(local.required),
    userHrCode: Yup.string().trim().max(100, local.maxLength100).required(local.required),
    userMobileNumber: Yup.string().min(11, local.minLength11),
    userNationalId: Yup.number()
    .when('nationalIdChecker', {
        is: true,
        then: Yup.number().test('error', local.duplicateNationalIdMessage, () => false),
        otherwise: Yup.number().required().min(10000000000000, local.nationalIdLengthShouldBe14).max(99999999999999, local.nationalIdLengthShouldBe14).required(local.required)
    }),
    userPassword: Yup.string().required(local.required),
    userConfirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null],local.confrimPasswordCheck),

});