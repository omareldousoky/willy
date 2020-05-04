import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

export const paymentValidation = Yup.object().shape({
    payAmount: Yup.string().required(local.required),
    truthDate: Yup.string().required(local.required)
})