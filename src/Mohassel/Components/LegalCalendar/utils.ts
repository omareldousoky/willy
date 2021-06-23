import arSA from 'date-fns/locale/ar-SA'
import format from 'date-fns/format'

export const DAYS_OF_WEEK = [
  'السبت',
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
]
export enum WEEKS {
  'الاسبوع الأول' = 1,
  'الأسبوع الثاني',
  'الأسبوع الثالث',
  'الأسبوع الرابع',
  'الأسبوع الخامس',
}
export const initFormattedEvents = {
  '0': [],
  '1': [],
  '2': [],
  '3': [],
  '4': [],
  '5': [],
}
export const MIN_ROWS = 10

export const formatWrapper = (date = new Date(), formatUnit) => {
  return format(date, formatUnit, { locale: arSA })
}
