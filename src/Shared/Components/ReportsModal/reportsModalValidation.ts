import { array, object, ObjectSchema, Shape, string } from 'yup'
import * as local from '../../Assets/ar.json'

const minYear = new Date(2021, 0, 1)
export const reportsModalValidation: ObjectSchema<
  Shape<object, object>
> = object().shape({
  fromDate: string(),
  toDate: string(),
  branches: array().nullable().min(1, local.mustBeOneOrMore),
  key: string(),
  quarterYear: string().test(
    'Min Date',
    local.dateCantBeBefore2021,
    (value: string) => {
      return value ? new Date(value).valueOf() >= minYear.valueOf() : true
    }
  ),
  date: string(),
  loanOfficers: array().nullable(),
  representatives: array().nullable(),
  geoAreas: array().nullable(),
  loanApplicationKey: string(),
  managers: array().nullable().min(1, local.mustBeOneOrMore),
})
