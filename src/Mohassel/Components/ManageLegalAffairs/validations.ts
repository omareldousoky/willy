import * as Yup from 'yup'
import local from '../../../Shared/Assets/ar.json'

export const defaultValidationSchema = Yup.string()
  .trim()
  .max(100, local.maxLength100)
