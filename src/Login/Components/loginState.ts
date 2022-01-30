import * as Yup from 'yup'
import * as local from 'Shared/Assets/ar.json'

export const loginCred: any = {
  username: '',
  password: '',
}
export const loginCredValidation = Yup.object().shape({
  username: Yup.string().required(local.required),
  password: Yup.string().required(local.required),
})
