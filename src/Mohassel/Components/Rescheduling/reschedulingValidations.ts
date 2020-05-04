import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

export const reschedulingValidation = Yup.object().shape({
    noOfInstallments: Yup.number().integer('Must be int').min(1, 'Must be 1 or more').required(local.required),
    withInterest: Yup.boolean().required(local.required),
    postponementInterest: Yup.number().moreThan(0, "Can't be 0 or less").max(100, "Can't be more than 100").required('required!'),
    payWhere: Yup.string().required('required!'),
})