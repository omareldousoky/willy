import * as Yup from 'yup'
import local from '../../../Shared/Assets/ar.json'

export const defaultValidationSchema = Yup.string()
  .trim()
  .max(100, local.maxLength100)

const EgyptPhoneNumberReGex = /^01[0125][0-9]{8}$/
export const phoneNumberValidationSchema = Yup.string()
  .trim()
  .matches(EgyptPhoneNumberReGex, `${local.example}: 01234567891`)
