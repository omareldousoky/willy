import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

export const step1: any = {
    roleName: '',
    hQpermission: false
};

export const roleCreationStep1Validation = Yup.object().shape({
    roleName: Yup.string().required(local.required),
    hQpermission: Yup.boolean().required(local.required)
})