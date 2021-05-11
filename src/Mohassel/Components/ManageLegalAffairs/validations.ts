import * as Yup from 'yup'
import local from '../../../Shared/Assets/ar.json'

export const defaultValidationSchema = Yup.string()
  .trim()
  .max(100, local.maxLength100)

export const phoneNumberValidationSchema = Yup.string()
  .min(10, local.minLength10)
  .max(11, local.maxLength11)
