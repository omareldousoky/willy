import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

export const reportsModalValidation = Yup.object().shape({
    fromDate: Yup.string(),
    toDate: Yup.string(),
    branches: Yup.array(),
    key: Yup.string(),
})