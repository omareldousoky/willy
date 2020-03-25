import * as Yup from 'yup';

export const assignProductToBranch: any = {
    branch: ''
}
export const assignProductToBranchValidation = Yup.object().shape({
    branch: Yup.object().shape({
        label:Yup.string().required('required!'),
        value:Yup.string().required('required!'),
    }).required('required!')
})