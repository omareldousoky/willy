import local from './Assets/ar.json'
import { numbersToArabic } from './Services/utils'

export const missingKey = (key: string) => `${local[key]} غير موجود`

export const maxValue = (value: number | string) =>
  `لا يمكن ان يكون اكثر من ${value}`
export const minValue = (value: number | string) =>
  `لا يمكن ان يكون اقل من ${numbersToArabic(value)}`

export const addeddSuccessfully = (entity: string) =>
  `تم إضافة ${local[entity]} بنجاح`

export const doneSuccessfully = (entity?: string) =>
  `تم ${entity ? local[entity] : ''} بنجاح`
