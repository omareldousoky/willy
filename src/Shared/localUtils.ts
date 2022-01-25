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
export const ageRangeError = (minAge: number, maxAge: number) =>
  `يجب ان يكون عمر العميل من ${minAge} الى ${maxAge} عاما`

export const moreThanValue = (value: number | string) =>
  ` يجب أن يكون أكبر من ${numbersToArabic(value)}`

export const moreThanCharacters = (value: number | string) =>
  ` لا يمكن أن يكون أكثر من ${numbersToArabic(value)} حرف`
