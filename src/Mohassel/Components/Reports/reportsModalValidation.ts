import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

export const reportsModalValidation = Yup.object().shape({
    fromDate: Yup.string().required(local.required),
    toDate: Yup.string().required(local.required),
    branches: Yup.array().required(local.required),
    code: Yup.string().required(local.required)
})