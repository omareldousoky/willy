import local from '../Shared/Assets/ar.json'

export const missingKey = (key: string) => `${local[key]} غير موجود`
export const addeddSuccessfully = (entity: string) =>
  `تم إضافة ${local[entity]} بنجاح`
