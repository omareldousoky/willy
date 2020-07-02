import * as Yup from 'yup';

export const loginCred: any = {
    username: '',
    password: ''
}
export const loginCredValidation = Yup.object().shape({
    username: Yup.string().required('required!'),
    password: Yup.string().required('required!')
})