import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';
import { Values, RolesBranchesValues } from './userCreationinterfaces';

export const step1: Values = {
    name: '',
    username: '',
    nationalId: '',
    hrCode: '',
    mobilePhoneNumber: '',
    hiringDate: 0,
    password: '',
    confirmPassword: '',
}

export const userRolesOptions = [
    { label: "مراجع إداري", value: '1' ,hasBranch:'true'},
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
export const step2: RolesBranchesValues = {
    roles: [],
    branches:[],

}
export const userCreationValidationStepOne = Yup.object().shape({
    name: Yup.string().trim().max(100, local.maxLength100).required(local.required),
    username: Yup.string().trim().max(100, local.maxLength100).required(local.required),
    hrCode: Yup.string().trim().max(100, local.maxLength100).required(local.required),
    mobilePhoneNumber: Yup.string().min(11, local.minLength11),
    nationalId: Yup.number().required(local.required),
    // .when('nationalIdChecker', {
    //     is: true,
    //     then: Yup.number().test('error', local.duplicateNationalIdMessage, () => false),
    //     otherwise: Yup.number().required().min(10000000000000, local.nationalIdLengthShouldBe14).max(99999999999999, local.nationalIdLengthShouldBe14).required(local.required)
    // }),
    password: Yup.string().required(local.required),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], local.confrimPasswordCheck),

})
export const userCreationValidationStepTwo = Yup.object().shape({
    roles: Yup.array().min(1).of(
        Yup.object().shape({
            lable: Yup.string().required(local.required),
            value: Yup.string().required(local.required),
            hasBranch: Yup.boolean().required(local.required)
        })
    ),
    branches: Yup.array().of(
        Yup.object().shape({
            label: Yup.string(),
            value: Yup.string(),
        })
    ),
})


