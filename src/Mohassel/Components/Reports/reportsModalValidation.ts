import * as Yup from 'yup';
import * as local from '../../../Shared/Assets/ar.json';

const currentYear =   new Date(2020,0,1);
export const reportsModalValidation = Yup.object().shape({
    fromDate: Yup.string(),
    toDate: Yup.string(),
    branches: Yup.array().nullable(),
    key: Yup.string(),
    quarterYear:  Yup.string().test(
        "Max Date", local.dateShouldBeBeforeToday,
        (value: any) => { return value ? new Date(value).valueOf() >= currentYear.valueOf() : true }
    ).required(local.required),
})