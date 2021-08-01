import local from '../Shared/Assets/ar.json'

export const missingKey = (key: string) => `${local[key]} غير موجود`

export const maxValue = (value: number | string) =>
  `لا يمكن ان يكون اكثر من ${value}`
export const minValue = (value: number | string) =>
  `لا يمكن ان يكون اقل من ${value}`

export const addeddSuccessfully = (entity: string) =>
  `تم إضافة ${local[entity]} بنجاح`
