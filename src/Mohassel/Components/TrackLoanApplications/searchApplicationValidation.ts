import * as Yup from 'yup'
import * as local from '../../../Shared/Assets/ar.json'
import { endOfDayValue } from '../../../Shared/Services/utils'

export const searchApplicationValidation = Yup.object().shape({
  dateFrom: Yup.string().test(
    'Max Date',
    local.dateShouldBeBeforeToday,
    (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDayValue : true
    }
  ),
  // .required(local.required),
  dateTo: Yup.string().test(
    'Max Date',
    local.dateShouldBeBeforeToday,
    (value: any) => {
      return value ? new Date(value).valueOf() <= endOfDayValue : true
    }
  ),
  searchKeyword: Yup.string(),
})
