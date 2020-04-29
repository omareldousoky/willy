import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';
import { Values, RolesValues } from './userCreationinterfaces';

export const step1: Values = {
    userFullName: '',
    userName: '',
    userNationalId: '',
    userHrCode: '',
    userMobileNumber: '',
    userHiringDate: '',
    userPassword: '',
    userConfirmPassword: '',
}

export const userRolesOptions = [
    { label: "مراجع إداري", value: '1' },
    { label: "مراجع مالي", value: '2' },
    { label: "مدخل بيانات", value: '3' },
];
export const userBranchesOptions = [
    { label: 'سوهاج', value: '1' },
    { label: 'الجيزة', value: '2' },
    { label: 'القاهرة', value: '3' },
    { label: '1سوهاج', value: '4' },
    { label: '1الجيزة', value: '5' },
    { label: '1القاهرة', value: '6' },
    { label: '2سوهاج', value: '7' },
    { label: '2الجيزة', value: '8' },
    { label: '2القاهرة', value: '9' },
];
export const step2: RolesValues = {
    userRoles: [],
    userBranches: [],

}
export const userCreationValidationStepOne = Yup.object().shape({
    userFullName: Yup.string().trim().max(100, local.maxLength100).required(local.required),
    userName: Yup.string().trim().max(100, local.maxLength100).required(local.required),
    userHrCode: Yup.string().trim().max(100, local.maxLength100).required(local.required),
    userMobileNumber: Yup.string().min(11, local.minLength11),
    userNationalId: Yup.number().required(local.required),
    // .when('nationalIdChecker', {
    //     is: true,
    //     then: Yup.number().test('error', local.duplicateNationalIdMessage, () => false),
    //     otherwise: Yup.number().required().min(10000000000000, local.nationalIdLengthShouldBe14).max(99999999999999, local.nationalIdLengthShouldBe14).required(local.required)
    // }),
    userPassword: Yup.string().required(local.required),
    userConfirmPassword: Yup.string()
        .oneOf([Yup.ref('userPassword'), null], local.confrimPasswordCheck),

})
export const userCreationValidationStepTwo = Yup.object().shape({
    userRoles: Yup.array().min(1).of(
        Yup.object().shape({
            lable: Yup.string().required(local.required),
            value: Yup.string().required(local.required),
            hasBranch: Yup.boolean().required(local.required)
        })
    ),
    userBranches: Yup.array().of(
        Yup.object().shape({
            label: Yup.string(),
            value: Yup.string(),
        })
    ),
})