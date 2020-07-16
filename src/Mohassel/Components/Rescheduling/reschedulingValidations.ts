import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

export const reschedulingValidation = Yup.object().shape({
    noOfInstallments: Yup.number().integer('Must be int').min(1, 'Must be 1 or more').required(local.required),
    withInterest: Yup.boolean().required(local.required),
    postponementInterest: Yup.number().when("withInterest", {
        is: (val) => val === true,
        then: Yup.number().moreThan(0, "Can't be 0 or less").max(100, "Can't be more than 100").required(local.required),
        otherwise: Yup.number().notRequired()
    }),
    payWhere: Yup.string().when("withInterest", {
        is: (val) => val === true,
        then: Yup.string().required(local.required),
        otherwise: Yup.string().notRequired()
    }),
    installmentNumber: Yup.number().when("withInterest", {
        is: (val) => val === true,
        then: Yup.number().required(local.required),
        otherwise: Yup.number().notRequired()
    })
})
export const traditionalReschedulingValidation = Yup.object().shape({
    noOfInstallments: Yup.number().integer('Must be int').min(1, 'Must be 1 or more').required(local.required),
})