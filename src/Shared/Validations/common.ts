import * as local from '../Assets/ar.json'

export const required = (value?: string) =>
  !value?.trim() ? local.required : undefined
