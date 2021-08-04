import * as Yup from 'yup'
import * as local from '../../../Shared/Assets/ar.json'

export const step1: any = {
  roleName: '',
  hQpermission: false,
  managerRole: '',
}

export const roleCreationStep1Validation = Yup.object().shape({
  roleName: Yup.string()
    .trim()
    .max(100, local.maxLength100)
    .required(local.required),
  hQpermission: Yup.boolean().required(local.required),
})
